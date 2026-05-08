import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export async function ensureDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is missing. Skipping default admin bootstrap.');
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
    }

    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await User.create({
    name: process.env.ADMIN_NAME?.trim() || 'Platform Administrator',
    email: adminEmail,
    phone: 'N/A',
    organization: process.env.APP_NAME?.trim() || 'Definites Legal',
    role: 'admin',
    passwordHash,
    isActive: true,
    mustChangePassword: false,
    lastPasswordChangedAt: new Date(),
  });

  console.log(`Default admin account created for ${adminEmail}`);
}
