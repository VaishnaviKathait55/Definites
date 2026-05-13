import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMail } from '../config/mailer.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateResetToken } from '../utils/passwords.js';
import { serializeUser } from '../utils/serializers.js';

function createJwt(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  );
}

function buildResetEmail({ name, email, resetToken }) {
  const appName = process.env.APP_NAME || 'Definites Legal Practice Management';
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  const resetHours = Number(process.env.RESET_TOKEN_EXPIRES_HOURS || 2);

  return {
    subject: `${appName}: password reset instructions`,
    text: [
      `Hello ${name},`,
      '',
      `Use the link below to set a new password for ${appName}:`,
      resetUrl,
      '',
      `This link expires in ${resetHours} hour(s).`,
      '',
      'If you did not request this reset, you can ignore this email.',
    ].join('\n'),
    html: `
      <p>Hello ${name},</p>
      <p>Use the link below to set a new password for <strong>${appName}</strong>:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in ${resetHours} hour(s).</p>
      <p>If you did not request this reset, you can ignore this email.</p>
    `,
  };
}

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.', 'VALIDATION_ERROR');
  }

  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  if (user.mustChangePassword && user.tempPasswordExpiresAt && user.tempPasswordExpiresAt.getTime() < Date.now()) {
    throw new ApiError(
      403,
      'Your temporary password has expired. Please request a password reset.',
      'PASSWORD_EXPIRED',
    );
  }

  const token = createJwt(user);

  res.json({
    message: 'Login successful.',
    token,
    mustChangePassword: user.mustChangePassword,
    user: serializeUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: serializeUser(req.auth.user),
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required.', 'VALIDATION_ERROR');
  }

  if (newPassword.length < 10) {
    throw new ApiError(400, 'New password must be at least 10 characters long.', 'WEAK_PASSWORD');
  }

  const user = await User.findById(req.auth.user._id);
  const currentPasswordMatches = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!currentPasswordMatches) {
    throw new ApiError(401, 'Current password is incorrect.', 'INVALID_CURRENT_PASSWORD');
  }

  const reusedPassword = await bcrypt.compare(newPassword, user.passwordHash);

  if (reusedPassword) {
    throw new ApiError(400, 'New password must be different from the current password.', 'PASSWORD_REUSE');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  user.tempPasswordExpiresAt = null;
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpiresAt = null;
  user.lastPasswordChangedAt = new Date();
  await user.save();

  res.json({
    message: 'Password updated successfully.',
    user: serializeUser(user),
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    throw new ApiError(400, 'Email is required.', 'VALIDATION_ERROR');
  }

  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    return res.json({
      message: 'If the email exists in our system, reset instructions have been sent.',
    });
  }

  const { token, tokenHash } = generateResetToken();
  const resetHours = Number(process.env.RESET_TOKEN_EXPIRES_HOURS || 2);

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetTokenExpiresAt = new Date(Date.now() + resetHours * 60 * 60 * 1000);
  await user.save();

  const resetEmail = buildResetEmail({
    name: user.name,
    email: user.email,
    resetToken: token,
  });

  await sendMail({
    to: user.email,
    subject: resetEmail.subject,
    text: resetEmail.text,
    html: resetEmail.html,
  });

  res.json({
    message: 'If the email exists in our system, reset instructions have been sent.',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const token = req.body.token?.trim();
  const newPassword = req.body.newPassword;

  if (!email || !token || !newPassword) {
    throw new ApiError(400, 'Email, token, and new password are required.', 'VALIDATION_ERROR');
  }

  if (newPassword.length < 10) {
    throw new ApiError(400, 'New password must be at least 10 characters long.', 'WEAK_PASSWORD');
  }

  const crypto = await import('crypto');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    email,
    passwordResetTokenHash: tokenHash,
    passwordResetTokenExpiresAt: { $gt: new Date() },
    isActive: true,
  });

  if (!user) {
    throw new ApiError(400, 'This password reset link is invalid or expired.', 'RESET_LINK_INVALID');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.mustChangePassword = false;
  user.tempPasswordExpiresAt = null;
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpiresAt = null;
  user.lastPasswordChangedAt = new Date();
  await user.save();

  res.json({
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});
