import { AccessRequest } from '../models/AccessRequest.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { serializeAccessRequest } from '../utils/serializers.js';
import { sendMail } from '../config/mailer.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QUERY_WORDS = 100;
const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

// const buildEmailHtml = ({ name, email, phone, organization, query }) => `
//   <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
//     <h2>New Contact Request — ${name}</h2>
//     <p><strong>Email:</strong> ${email}</p>
//     <p><strong>Phone:</strong> ${phone}</p>
//     <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
//     <p><strong>Query:</strong> ${query}</p>
//     <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
//   </div>
// `;

const buildEmailHtml = ({ name, email, phone, organization, query }) => `
  <div style="font-family: 'Georgia', serif; max-width: 620px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a3c34 0%, #0f2a24 100%); padding: 32px 40px; position: relative;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="width: 36px; height: 36px; background: #c9a84c; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff; font-weight: bold;">◆</div>
        <div>
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.3px;">Definites Consultants</h1>
          <p style="color: #a8c5be; margin: 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Legal & Advisory Services</p>
        </div>
      </div>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
        <span style="background: #c9a84c; color: #1a1a1a; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px;">New Contact Request</span>
      </div>
    </div>
  
    <!-- Body -->
    <div style="padding: 36px 40px;">
  
      <!-- Greeting -->
      <p style="margin: 0 0 24px; font-size: 15px; color: #444; line-height: 1.6;">
        A new inquiry has been submitted through the website. Here are the details:
      </p>
  
      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 28px;">
        <tr style="background: #f7f9f8;">
          <td style="padding: 12px 16px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; width: 130px; border-radius: 4px 0 0 4px;">Name</td>
          <td style="padding: 12px 16px; color: #1a1a1a; font-weight: 600; font-size: 15px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">Email</td>
          <td style="padding: 12px 16px;"><a href="mailto:${email}" style="color: #1a3c34; font-weight: 500; text-decoration: none; border-bottom: 1px solid #a8c5be;">${email}</a></td>
        </tr>
        <tr style="background: #f7f9f8;">
          <td style="padding: 12px 16px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">Phone</td>
          <td style="padding: 12px 16px; color: #1a1a1a;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">Organization</td>
          <td style="padding: 12px 16px; color: #1a1a1a;">${organization || '<span style="color:#bbb; font-style:italic;">Not provided</span>'}</td>
        </tr>
        <tr style="background: #f7f9f8;">
          <td style="padding: 12px 16px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">Submitted</td>
          <td style="padding: 12px 16px; color: #1a1a1a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>
  
      <!-- Query Block -->
      <div style="background: #f7f9f8; border-left: 4px solid #1a3c34; border-radius: 0 8px 8px 0; padding: 20px 24px; margin-bottom: 28px;">
        <p style="margin: 0 0 10px; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Query</p>
        <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.8;">${query}</p>
      </div>
  
      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 8px;">
        <a href="mailto:${email}" style="display: inline-block; background: #1a3c34; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 6px; letter-spacing: 0.5px;">Reply to ${name}</a>
      </div>
  
      <p style="margin-top: 20px; font-size: 12px; color: #bbb; text-align: center;">
        Clicking "Reply to ${name}" will open a new email addressed to <strong>${email}</strong>
      </p>
  
    </div>
  
    <!-- Footer -->
    <div style="background: #f7f9f8; border-top: 1px solid #e8e8e8; padding: 20px 40px; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 12px; color: #aaa;">This is an automated notification from your website contact form.</p>
      <p style="margin: 0; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Definites Consultants · <a href="https://definitesconsultants.com" style="color: #1a3c34; text-decoration: none;">definitesconsultants.com</a></p>
    </div>
  
  </div>
  `;

export const createAccessRequest = asyncHandler(async (req, res) => {
  const name         = req.body.name?.trim();
  const email        = req.body.email?.trim().toLowerCase();
  const phone        = req.body.phone?.trim();
  const organization = req.body.organization?.trim() || '';
  const query        = req.body.query?.trim() || '';

  console.log('📩 Request received:', { name, email, phone, organization, query });

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

  const accessRequest = await AccessRequest.create({ name, email, phone, organization, query });

  try {
    const result = await sendMail({
      to: process.env.MAIL_TO || 'info@definitesconsultants.com',
      replyTo: email,
      subject: `New Contact Request — ${name}`,
      html: buildEmailHtml({ name, email, phone, organization, query }),
    });
    console.log('✅ Email sent successfully:', result);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }

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
// import { sendMail } from '../config/mailer.js'; // ✅ correct import

// const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const MAX_QUERY_WORDS = 100;
// const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

// const buildEmailHtml = ({ name, email, phone, organization, query }) => `
//   <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//     <div style="background: #1a3c34; padding: 24px 32px;">
//       <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Definites Consultants</h1>
//       <p style="color: #a8c5be; margin: 4px 0 0; font-size: 13px;">New Contact Request</p>
//     </div>
//     <div style="padding: 32px;">
//       <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//         <tr style="border-bottom: 1px solid #f0f0f0;">
//           <td style="padding: 10px 0; color: #888; width: 140px;">Name</td>
//           <td style="padding: 10px 0; color: #1a1a1a; font-weight: 600;">${name}</td>
//         </tr>
//         <tr style="border-bottom: 1px solid #f0f0f0;">
//           <td style="padding: 10px 0; color: #888;">Email</td>
//           <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #1a3c34;">${email}</a></td>
//         </tr>
//         <tr style="border-bottom: 1px solid #f0f0f0;">
//           <td style="padding: 10px 0; color: #888;">Phone</td>
//           <td style="padding: 10px 0; color: #1a1a1a;">${phone}</td>
//         </tr>
//         <tr style="border-bottom: 1px solid #f0f0f0;">
//           <td style="padding: 10px 0; color: #888;">Organization</td>
//           <td style="padding: 10px 0; color: #1a1a1a;">${organization || 'Not provided'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 10px 0; color: #888;">Submitted</td>
//           <td style="padding: 10px 0; color: #1a1a1a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
//         </tr>
//       </table>

//       <div style="margin-top: 24px; background: #f7f9f8; border-left: 3px solid #1a3c34; padding: 16px 20px; border-radius: 4px;">
//         <p style="margin: 0 0 8px; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Query</p>
//         <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">${query}</p>
//       </div>

//       <p style="margin-top: 24px; font-size: 13px; color: #aaa;">
//         Reply directly to this email to respond to ${name}.
//       </p>
//     </div>
//   </div>
// `;

// export const createAccessRequest = asyncHandler(async (req, res) => {
//   // ── 1. Parse & sanitise ───────────────────────────────────────────────────
//   const name         = req.body.name?.trim();
//   const email        = req.body.email?.trim().toLowerCase();
//   const phone        = req.body.phone?.trim();
//   const organization = req.body.organization?.trim() || '';
//   const query        = req.body.query?.trim() || '';

//   // ── 2. Validate ───────────────────────────────────────────────────────────
//   if (!name || !email || !phone) {
//     throw new ApiError(400, 'Name, email, and phone are required.', 'VALIDATION_ERROR');
//   }
//   if (!EMAIL_PATTERN.test(email)) {
//     throw new ApiError(400, 'Please enter a valid email address.', 'INVALID_EMAIL');
//   }
//   if (!query) {
//     throw new ApiError(400, 'Please provide a query.', 'VALIDATION_ERROR');
//   }
//   if (countWords(query) > MAX_QUERY_WORDS) {
//     throw new ApiError(400, `Query must not exceed ${MAX_QUERY_WORDS} words.`, 'VALIDATION_ERROR');
//   }

//   // ── 3. Duplicate checks ───────────────────────────────────────────────────
//   const existingUser = await User.findOne({ email, isActive: true });
//   if (existingUser) {
//     throw new ApiError(409, 'An active account already exists for this email.', 'USER_EXISTS');
//   }

//   const pendingRequest = await AccessRequest.findOne({ email, status: 'pending' });
//   if (pendingRequest) {
//     throw new ApiError(409, 'An access request for this email is already pending review.', 'REQUEST_EXISTS');
//   }

//   // ── 4. Persist ────────────────────────────────────────────────────────────
//   const accessRequest = await AccessRequest.create({ name, email, phone, organization, query });

//   // ── 5. Send notification email ────────────────────────────────────────────
//   try {
//     const info = await sendMail({
//       to: process.env.MAIL_TO || 'info@definitesconsultants.com',
//       replyTo: email,
//       subject: `New Contact Request — ${name}`,
//       html: buildEmailHtml({ name, email, phone, organization, query }),
//     });
//     console.log('Email sent:', info.messageId ?? info.response ?? 'ok');
//   } catch (err) {
//     console.error('Email notification failed:', {
//       message:  err.message,
//       code:     err.code     ?? 'n/a',
//       response: err.response ?? 'n/a',
//     });
//   }

//   // ── 6. Respond ────────────────────────────────────────────────────────────
//   res.status(201).json({
//     message: 'Your query has been submitted successfully. Our team will get back to you shortly.',
//     accessRequest: serializeAccessRequest(accessRequest),
//   });
// });




