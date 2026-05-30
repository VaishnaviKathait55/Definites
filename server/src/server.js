import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { ensureDefaultAdmin } from './services/bootstrapAdmin.js';

dotenv.config();

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required.');

let isInitialized = false;

async function initialize() {
  if (isInitialized) return;
  await connectDatabase(process.env.MONGODB_URI);
  await ensureDefaultAdmin();
  isInitialized = true;
}

const app = createApp();

// ✅ Export for Vercel serverless
export default async function handler(req, res) {
  await initialize();
  app(req, res);
}

// ✅ Also start normally for local development
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT || 4000);
  initialize().then(() => {
    app.listen(port, () => console.log(`Server listening on ${port}`));
  });
}


// import dotenv from 'dotenv';
// import { createApp } from './app.js';
// import { connectDatabase } from './config/db.js';
// import { ensureDefaultAdmin } from './services/bootstrapAdmin.js';

// dotenv.config();

// if (!process.env.MONGODB_URI) {
//   throw new Error('MONGODB_URI is required.');
// }

// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET is required.');
// }

// const port = Number(process.env.PORT || 4000);

// async function startServer() {
//   await connectDatabase(process.env.MONGODB_URI);
//   await ensureDefaultAdmin();

//   const app = createApp();

//   app.listen(port, () => {
//     console.log(`Server listening on ${port}`);
//   });
// }

// startServer().catch((error) => {
//   console.error('Server failed to start');
//   console.error(error);
//   process.exit(1);
// });
