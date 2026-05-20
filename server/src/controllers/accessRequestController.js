import { AccessRequest } from '../models/AccessRequest.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { serializeAccessRequest } from '../utils/serializers.js';
import { sendMail } from '../config/mailer.js'; // ✅ correct import

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QUERY_WORDS = 100;
const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

const buildEmailHtml = ({ name, email, phone, organization, query }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background: #1a3c34; padding: 24px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Definites Consultants</h1>
      <p style="color: #a8c5be; margin: 4px 0 0; font-size: 13px;">New Contact Request</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; width: 140px;">Name</td>
          <td style="padding: 10px 0; color: #1a1a1a; font-weight: 600;">${name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888;">Email</td>
          <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #1a3c34;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888;">Phone</td>
          <td style="padding: 10px 0; color: #1a1a1a;">${phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888;">Organization</td>
          <td style="padding: 10px 0; color: #1a1a1a;">${organization || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #888;">Submitted</td>
          <td style="padding: 10px 0; color: #1a1a1a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; background: #f7f9f8; border-left: 3px solid #1a3c34; padding: 16px 20px; border-radius: 4px;">
        <p style="margin: 0 0 8px; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Query</p>
        <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">${query}</p>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #aaa;">
        Reply directly to this email to respond to ${name}.
      </p>
    </div>
  </div>
`;

export const createAccessRequest = asyncHandler(async (req, res) => {
  // ── 1. Parse & sanitise ───────────────────────────────────────────────────
  const name         = req.body.name?.trim();
  const email        = req.body.email?.trim().toLowerCase();
  const phone        = req.body.phone?.trim();
  const organization = req.body.organization?.trim() || '';
  const query        = req.body.query?.trim() || '';

  // ── 2. Validate ───────────────────────────────────────────────────────────
  if (!name || !email || !phone) {
    throw new ApiError(400, 'Name, email, and phone are required.', 'VALIDATION_ERROR');
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new ApiError(400, 'Please enter a valid email address.', 'INVALID_EMAIL');
  }
  if (!query) {
    throw new ApiError(400, 'Please provide a query.', 'VALIDATION_ERROR');
  }
  if (countWords(query) > MAX_QUERY_WORDS) {
    throw new ApiError(400, `Query must not exceed ${MAX_QUERY_WORDS} words.`, 'VALIDATION_ERROR');
  }

  // ── 3. Duplicate checks ───────────────────────────────────────────────────
  const existingUser = await User.findOne({ email, isActive: true });
  if (existingUser) {
    throw new ApiError(409, 'An active account already exists for this email.', 'USER_EXISTS');
  }

  const pendingRequest = await AccessRequest.findOne({ email, status: 'pending' });
  if (pendingRequest) {
    throw new ApiError(409, 'An access request for this email is already pending review.', 'REQUEST_EXISTS');
  }

  // ── 4. Persist ────────────────────────────────────────────────────────────
  const accessRequest = await AccessRequest.create({ name, email, phone, organization, query });

  // ── 5. Send notification email ────────────────────────────────────────────
  try {
    const info = await sendMail({
      to: process.env.MAIL_TO || 'info@definitesconsultants.com',
      replyTo: email,
      subject: `New Contact Request — ${name}`,
      html: buildEmailHtml({ name, email, phone, organization, query }),
    });
    console.log('Email sent:', info.messageId ?? info.response ?? 'ok');
  } catch (err) {
    console.error('Email notification failed:', {
      message:  err.message,
      code:     err.code     ?? 'n/a',
      response: err.response ?? 'n/a',
    });
  }

  // ── 6. Respond ────────────────────────────────────────────────────────────
  res.status(201).json({
    message: 'Your query has been submitted successfully. Our team will get back to you shortly.',
    accessRequest: serializeAccessRequest(accessRequest),
  });
});





// import { AccessRequest } from '../models/AccessRequest.js';
// import { User } from '../models/User.js';
// import { ApiError } from '../utils/ApiError.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import { serializeAccessRequest } from '../utils/serializers.js';
// import { getTransporter } from '../utils/mailer.js';

// const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const MAX_QUERY_WORDS = 100;
// const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

// export const createAccessRequest = asyncHandler(async (req, res) => {
//   const name         = req.body.name?.trim();
//   const email        = req.body.email?.trim().toLowerCase();
//   const phone        = req.body.phone?.trim();
//   const organization = req.body.organization?.trim() || '';
//   const query        = req.body.query?.trim() || '';

//   if (!name || !email || !phone) {
//     throw new ApiError(400, 'Name, email, and phone are required.', 'VALIDATION_ERROR');
//   }
//   if (!query) {
//     throw new ApiError(400, 'Please provide a query.', 'VALIDATION_ERROR');
//   }
//   if (countWords(query) > MAX_QUERY_WORDS) {
//     throw new ApiError(400, `Query must not exceed ${MAX_QUERY_WORDS} words.`, 'VALIDATION_ERROR');
//   }
//   if (!EMAIL_PATTERN.test(email)) {
//     throw new ApiError(400, 'Please enter a valid email address.', 'INVALID_EMAIL');
//   }

//   // const existingUser = await User.findOne({ email, isActive: true });
//   // if (existingUser) {
//   //   throw new ApiError(409, 'An active account already exists for this email.', 'USER_EXISTS');
//   // }

//   // const pendingRequest = await AccessRequest.findOne({ email, status: 'pending' });
//   // if (pendingRequest) {
//   //   throw new ApiError(409, 'An access request for this email is already pending review.', 'REQUEST_EXISTS');
//   // }

//   const accessRequest = await AccessRequest.create({ name, email, phone, organization, query });
// //   console.log('SMTP CONFIG:', {
// //   host: process.env.SMTP_HOST,
// //   port: process.env.SMTP_PORT,
// //   user: process.env.SMTP_USER,
// //   pass: process.env.SMTP_PASS ? `SET (${process.env.SMTP_PASS.length} chars)` : 'NOT SET',
// // });
//   // Transporter created here — dotenv is already loaded by this point
//   getTransporter().sendMail({
//     from: process.env.MAIL_FROM,
//     to: 'info@definitesconsultants.com',
//     replyTo: email,
//     subject: `New Contact Request — ${name}`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//         <div style="background: #1a3c34; padding: 24px 32px;">
//           <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Definites Consultants</h1>
//           <p style="color: #a8c5be; margin: 4px 0 0; font-size: 13px;">New Contact Request</p>
//         </div>
//         <div style="padding: 32px;">
//           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//             <tr style="border-bottom: 1px solid #f0f0f0;">
//               <td style="padding: 10px 0; color: #888; width: 140px;">Name</td>
//               <td style="padding: 10px 0; color: #1a1a1a; font-weight: 600;">${name}</td>
//             </tr>
//             <tr style="border-bottom: 1px solid #f0f0f0;">
//               <td style="padding: 10px 0; color: #888;">Email</td>
//               <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #1a3c34;">${email}</a></td>
//             </tr>
//             <tr style="border-bottom: 1px solid #f0f0f0;">
//               <td style="padding: 10px 0; color: #888;">Phone</td>
//               <td style="padding: 10px 0; color: #1a1a1a;">${phone}</td>
//             </tr>
//             <tr style="border-bottom: 1px solid #f0f0f0;">
//               <td style="padding: 10px 0; color: #888;">Organization</td>
//               <td style="padding: 10px 0; color: #1a1a1a;">${organization || 'Not provided'}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 0; color: #888;">Submitted</td>
//               <td style="padding: 10px 0; color: #1a1a1a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
//             </tr>
//           </table>

//           <div style="margin-top: 24px; background: #f7f9f8; border-left: 3px solid #1a3c34; padding: 16px 20px; border-radius: 4px;">
//             <p style="margin: 0 0 8px; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Query</p>
//             <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">${query}</p>
//           </div>

//           <p style="margin-top: 24px; font-size: 13px; color: #aaa;">
//             Reply directly to this email to respond to ${name}.
//           </p>
//         </div>
//       </div>
//     `,
//   }).catch((err) => console.error('Email notification failed:', err));

//   res.status(201).json({
//     message: 'Your query has been submitted successfully. Our team will get back to you shortly.',
//     accessRequest: serializeAccessRequest(accessRequest),
//   });
// });




