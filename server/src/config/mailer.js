import { Resend } from 'resend';

export async function sendMail({ to, replyTo, subject, html }) {
  const resend = new Resend(process.env.RESEND_API_KEY); 

  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM || 'Definites <onboarding@resend.dev>',
    to,
    replyTo,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
  return data;
}



// import nodemailer from 'nodemailer';

// let transporter;

// function buildTransport() {
//   if (process.env.SMTP_HOST) {
//     return nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT || 587),
//       secure: process.env.SMTP_SECURE === 'true',
//       auth: process.env.SMTP_USER
//         ? {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//           }
//         : undefined,
//     });
//   }

//   console.warn('SMTP settings missing. Falling back to JSON transport for local development.');
//   return nodemailer.createTransport({
//     jsonTransport: true,
//   });
// }

// export async function getMailer() {
//   if (!transporter) {
//     transporter = buildTransport();
//   }

//   return transporter;
// }

// export async function sendMail(message) {
//   const mailer = await getMailer();
//   const info = await mailer.sendMail({
//     from: process.env.MAIL_FROM || 'no-reply@example.com',
//     ...message,
//   });

//   if (info.message) {
//     console.log(`Mail preview for ${message.to}: ${info.message.toString()}`);
//   }

//   return info;
// }
