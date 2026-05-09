import bcrypt from 'bcrypt';
import { AccessRequest } from '../models/AccessRequest.js';
import { User } from '../models/User.js';
import { sendMail } from '../config/mailer.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTemporaryPassword } from '../utils/passwords.js';
import { serializeAccessRequest, serializeUser } from '../utils/serializers.js';

function buildApprovalEmail({ name, email, temporaryPassword }) {
  const appName = process.env.APP_NAME || 'Definites Portal';
  const loginUrl = `${process.env.FRONTEND_URL || 'https://definites.vercel.app'}/login`;
  const resetUrl = `${process.env.FRONTEND_URL || 'https://definites.vercel.app'}/change-password`;

  return {
    subject: `${appName}: your access has been approved`,
    text: [
      `Hello ${name},`,
      '',
      `Your access request for ${appName} has been approved.`,
      '',
      `Login URL: ${loginUrl}`,
      `Email: ${email}`,
      `Temporary password: ${temporaryPassword}`,
      '',
      'Important:',
      '- This temporary password expires in 7 days.',
      '- You must change it immediately after your first login.',
      `- If the password expires before you change it, request a reset here: ${resetUrl}`,
      '',
      'Regards,',
      appName,
    ].join('\n'),
    html: `
      <p>Hello ${name},</p>
      <p>Your access request for <strong>${appName}</strong> has been approved.</p>
      <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary password:</strong> ${temporaryPassword}</p>
      <p><strong>Important:</strong></p>
      <ul>
        <li>This temporary password expires in 7 days.</li>
        <li>You must change it immediately after your first login.</li>
        <li>If the password expires before you change it, request a reset from <a href="${resetUrl}">${resetUrl}</a>.</li>
      </ul>
      <p>Regards,<br />${appName}</p>
    `,
  };
}

function isSuccessfulMail(info) {
  const accepted = Array.isArray(info?.accepted) ? info.accepted.length : 0;
  const rejected = Array.isArray(info?.rejected) ? info.rejected.length : 0;

  if (rejected > 0) {
    return false;
  }

  if (accepted > 0) {
    return true;
  }

  return Boolean(info?.messageId || info?.response || info?.envelope || info?.message);
}

async function recordCredentialDelivery({ accessRequest, triggeredBy, status, info, error, note }) {
  const delivery = accessRequest.credentialDelivery || {
    status: 'not_sent',
    attempts: 0,
    lastAttemptAt: null,
    lastSentAt: null,
    lastError: '',
    lastMessageId: '',
    history: [],
  };

  const sentAt = new Date();

  delivery.attempts += 1;
  delivery.lastAttemptAt = sentAt;
  delivery.status = status;
  delivery.lastMessageId = info?.messageId || '';
  delivery.lastError = error?.message || '';

  if (status === 'sent') {
    delivery.lastSentAt = sentAt;
  }

  delivery.history = [
    ...(delivery.history || []),
    {
      status,
      triggeredBy,
      note: note || '',
      messageId: info?.messageId || '',
      error: error?.message || '',
      sentAt,
    },
  ];

  accessRequest.credentialDelivery = delivery;
  await accessRequest.save();

  return delivery;
}

async function sendCredentialEmail({
  accessRequest,
  temporaryPassword,
  triggeredBy,
  note,
}) {
  const approvalEmail = buildApprovalEmail({
    name: accessRequest.name,
    email: accessRequest.email,
    temporaryPassword,
  });

  try {
    const info = await sendMail({
      to: accessRequest.email,
      subject: approvalEmail.subject,
      text: approvalEmail.text,
      html: approvalEmail.html,
    });

    const deliveryStatus = isSuccessfulMail(info) ? 'sent' : 'failed';
    const delivery = await recordCredentialDelivery({
      accessRequest,
      triggeredBy,
      status: deliveryStatus,
      info,
      note,
    });

    if (deliveryStatus === 'failed') {
      throw new ApiError(502, 'Approval email was not accepted by the mail transport.', 'EMAIL_DELIVERY_FAILED');
    }

    return { info, delivery };
  } catch (error) {
    await recordCredentialDelivery({
      accessRequest,
      triggeredBy,
      status: 'failed',
      error,
      note,
    });
    throw new ApiError(502, `Approval email failed to send: ${error.message}`, 'EMAIL_DELIVERY_FAILED');
  }
}

export const getAccessRequests = asyncHandler(async (req, res) => {
  const status = req.query.status || 'pending';
  const filter = status === 'all' ? {} : { status };

  const accessRequests = await AccessRequest.find(filter)
    .sort({ createdAt: -1 })
    .populate('reviewedBy', 'name email')
    .populate('approvedUser', 'name email mustChangePassword tempPasswordExpiresAt')
    .populate('credentialDelivery.history.triggeredBy', 'name email');

  const summary = await AccessRequest.aggregate([
    {
      $group: {
        _id: '$status',
        total: { $sum: 1 },
      },
    },
  ]);

  const summaryMap = summary.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item._id]: item.total,
    }),
    { pending: 0, approved: 0, rejected: 0 },
  );

  res.json({
    requests: accessRequests.map(serializeAccessRequest),
    summary: summaryMap,
  });
});

export const approveAccessRequest = asyncHandler(async (req, res) => {
  const accessRequest = await AccessRequest.findById(req.params.requestId);

  if (!accessRequest) {
    throw new ApiError(404, 'Access request not found.', 'REQUEST_NOT_FOUND');
  }

  if (accessRequest.status !== 'pending') {
    throw new ApiError(409, 'Only pending requests can be approved.', 'REQUEST_NOT_PENDING');
  }

  const existingUser = await User.findOne({ email: accessRequest.email });

  if (existingUser) {
    throw new ApiError(409, 'A user account already exists for this request.', 'USER_EXISTS');
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const user = await User.create({
    name: accessRequest.name,
    email: accessRequest.email,
    phone: accessRequest.phone,
    organization: accessRequest.organization,
    role: 'user',
    passwordHash,
    isActive: true,
    mustChangePassword: true,
    tempPasswordExpiresAt: expiresAt,
    createdFromRequest: accessRequest._id,
    approvedAt: new Date(),
  });

  accessRequest.status = 'approved';
  accessRequest.reviewedAt = new Date();
  accessRequest.reviewedBy = req.auth.user._id;
  accessRequest.approvedUser = user._id;
  accessRequest.rejectionReason = '';

  try {
    await sendCredentialEmail({
      accessRequest,
      temporaryPassword,
      triggeredBy: req.auth.user._id,
      note: 'approval',
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    accessRequest.status = 'pending';
    accessRequest.reviewedAt = null;
    accessRequest.reviewedBy = null;
    accessRequest.approvedUser = null;
    await accessRequest.save();
    throw new ApiError(502, `Approval email failed to send: ${error.message}`, 'EMAIL_DELIVERY_FAILED');
  }

  const populatedRequest = await AccessRequest.findById(accessRequest._id)
    .populate('reviewedBy', 'name email')
    .populate('approvedUser', 'email');

  res.json({
    message: 'Access request approved and credentials emailed to the user.',
    request: serializeAccessRequest(populatedRequest),
    user: serializeUser(user),
  });
});

export const resendCredentials = asyncHandler(async (req, res) => {
  const accessRequest = await AccessRequest.findById(req.params.requestId);

  if (!accessRequest) {
    throw new ApiError(404, 'Access request not found.', 'REQUEST_NOT_FOUND');
  }

  if (accessRequest.status !== 'approved' || !accessRequest.approvedUser) {
    throw new ApiError(409, 'Only approved requests with a user account can be resent credentials.', 'REQUEST_NOT_APPROVED');
  }

  const user = await User.findById(accessRequest.approvedUser);

  if (!user) {
    throw new ApiError(404, 'Approved user account was not found.', 'USER_NOT_FOUND');
  }

  const previousState = {
    passwordHash: user.passwordHash,
    mustChangePassword: user.mustChangePassword,
    tempPasswordExpiresAt: user.tempPasswordExpiresAt,
    lastPasswordChangedAt: user.lastPasswordChangedAt,
  };

  const temporaryPassword = generateTemporaryPassword();
  user.passwordHash = await bcrypt.hash(temporaryPassword, 12);
  user.mustChangePassword = true;
  user.tempPasswordExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.lastPasswordChangedAt = null;
  await user.save();

  try {
    await sendCredentialEmail({
      accessRequest,
      temporaryPassword,
      triggeredBy: req.auth.user._id,
      note: 'resend',
    });
  } catch (error) {
    user.passwordHash = previousState.passwordHash;
    user.mustChangePassword = previousState.mustChangePassword;
    user.tempPasswordExpiresAt = previousState.tempPasswordExpiresAt;
    user.lastPasswordChangedAt = previousState.lastPasswordChangedAt;
    await user.save();
    throw error;
  }

  const populatedRequest = await AccessRequest.findById(accessRequest._id)
    .populate('reviewedBy', 'name email')
    .populate('approvedUser', 'name email mustChangePassword tempPasswordExpiresAt')
    .populate('credentialDelivery.history.triggeredBy', 'name email');

  res.json({
    message: 'Credential email resent successfully.',
    request: serializeAccessRequest(populatedRequest),
    user: serializeUser(user),
  });
});

export const rejectAccessRequest = asyncHandler(async (req, res) => {
  const accessRequest = await AccessRequest.findById(req.params.requestId);

  if (!accessRequest) {
    throw new ApiError(404, 'Access request not found.', 'REQUEST_NOT_FOUND');
  }

  if (accessRequest.status !== 'pending') {
    throw new ApiError(409, 'Only pending requests can be rejected.', 'REQUEST_NOT_PENDING');
  }

  accessRequest.status = 'rejected';
  accessRequest.reviewedAt = new Date();
  accessRequest.reviewedBy = req.auth.user._id;
  accessRequest.rejectionReason = req.body.reason?.trim() || '';
  await accessRequest.save();

  const populatedRequest = await AccessRequest.findById(accessRequest._id)
    .populate('reviewedBy', 'name email')
    .populate('approvedUser', 'name email mustChangePassword tempPasswordExpiresAt')
    .populate('credentialDelivery.history.triggeredBy', 'name email');

  res.json({
    message: 'Access request rejected.',
    request: serializeAccessRequest(populatedRequest),
  });
});
