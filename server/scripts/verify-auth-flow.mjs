import bcrypt from 'bcrypt';
import 'dotenv/config';
import { connectDatabase } from '../src/config/db.js';
import { AccessRequest } from '../src/models/AccessRequest.js';
import { User } from '../src/models/User.js';

const API_URL = `http://127.0.0.1:${process.env.PORT || 4000}/api`;
const TEST_EMAIL = `auth-flow-${Date.now()}@example.com`;
const TEST_NAME = 'Codex Flow Test';
const TEST_PHONE = '+1 555 000 1111';
const TEST_ORG = 'Definites QA';
const FORCED_TEMP_PASSWORD = 'TempPass!2345';
const FINAL_PASSWORD = 'PermanentPass!2345';
const TEST_EMAIL_PATTERN = /^auth-flow-\d+@example\.com$/;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = payload.code;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function main() {
  console.log(`Using API ${API_URL}`);
  await connectDatabase(process.env.MONGODB_URI);

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL?.trim().toLowerCase() });
  assert(existingAdmin, 'Admin account was not created.');
  console.log(`Admin account present: ${existingAdmin.email}`);

  await AccessRequest.deleteMany({ email: TEST_EMAIL_PATTERN });
  await User.deleteMany({ email: TEST_EMAIL_PATTERN });

  const requestResponse = await api('/access-requests', {
    method: 'POST',
    body: {
      name: TEST_NAME,
      email: TEST_EMAIL,
      phone: TEST_PHONE,
      organization: TEST_ORG,
    },
  });

  assert(requestResponse.accessRequest?.status === 'pending', 'Access request was not created as pending.');
  console.log(`Access request created: ${requestResponse.accessRequest.id}`);

  const requestRecord = await AccessRequest.findOne({ email: TEST_EMAIL, status: 'pending' });
  assert(requestRecord, 'Pending request was not persisted in MongoDB.');

  const adminLogin = await api('/auth/login', {
    method: 'POST',
    body: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });

  assert(adminLogin.user?.role === 'admin', 'Admin login failed.');
  console.log('Admin login succeeded.');

  const requestsPayload = await api('/admin/access-requests?status=pending', {
    token: adminLogin.token,
  });

  const pendingRequest = requestsPayload.requests.find((entry) => entry.email === TEST_EMAIL);
  assert(pendingRequest, 'Pending request was not returned in admin dashboard payload.');
  console.log('Admin can see pending request.');

  const approvalPayload = await api(`/admin/access-requests/${pendingRequest.id}/approve`, {
    method: 'POST',
    token: adminLogin.token,
  });

  assert(approvalPayload.request?.status === 'approved', 'Request was not approved.');
  console.log('Admin approval succeeded and email transport returned success.');

  const approvedUser = await User.findOne({ email: TEST_EMAIL });
  assert(approvedUser, 'Approved user record was not created.');
  assert(approvedUser.mustChangePassword === true, 'Approved user should be forced to change password.');
  assert(approvedUser.tempPasswordExpiresAt instanceof Date, 'Temporary password expiry was not set.');

  const expiryDeltaMs = approvedUser.tempPasswordExpiresAt.getTime() - Date.now();
  assert(expiryDeltaMs > 6.5 * 24 * 60 * 60 * 1000, 'Temporary password expiry is shorter than expected.');
  assert(expiryDeltaMs < 7.5 * 24 * 60 * 60 * 1000, 'Temporary password expiry is longer than expected.');
  console.log('Approved user record has 7-day temporary-password window.');

  approvedUser.passwordHash = await bcrypt.hash(FORCED_TEMP_PASSWORD, 12);
  await approvedUser.save();
  console.log('Test-only override applied so the temporary-password login flow can be exercised locally.');

  const userLogin = await api('/auth/login', {
    method: 'POST',
    body: {
      email: TEST_EMAIL,
      password: FORCED_TEMP_PASSWORD,
    },
  });

  assert(userLogin.mustChangePassword === true, 'User login should require password change.');
  console.log('User login with temporary password forces password change.');

  const changePasswordPayload = await api('/auth/change-password', {
    method: 'POST',
    token: userLogin.token,
    body: {
      currentPassword: FORCED_TEMP_PASSWORD,
      newPassword: FINAL_PASSWORD,
    },
  });

  assert(changePasswordPayload.user?.mustChangePassword === false, 'Password change did not clear mustChangePassword.');
  console.log('Password change succeeded.');

  const permanentLogin = await api('/auth/login', {
    method: 'POST',
    body: {
      email: TEST_EMAIL,
      password: FINAL_PASSWORD,
    },
  });

  assert(permanentLogin.mustChangePassword === false, 'Permanent login should not require password change.');
  console.log('User can log in with permanent password.');

  const expiryTestUser = await User.findOne({ email: TEST_EMAIL });
  assert(expiryTestUser, 'Unable to reload user for expiry validation.');

  expiryTestUser.passwordHash = await bcrypt.hash(FORCED_TEMP_PASSWORD, 12);
  expiryTestUser.mustChangePassword = true;
  expiryTestUser.tempPasswordExpiresAt = new Date(Date.now() - 60 * 1000);
  expiryTestUser.lastPasswordChangedAt = null;
  await expiryTestUser.save();

  let expiryBlocked = false;

  try {
    await api('/auth/login', {
      method: 'POST',
      body: {
        email: TEST_EMAIL,
        password: FORCED_TEMP_PASSWORD,
      },
    });
  } catch (error) {
    expiryBlocked = error.code === 'PASSWORD_EXPIRED';
  }

  assert(expiryBlocked, 'Expired temporary password was not blocked.');
  console.log('Expired temporary password is rejected correctly.');

  await AccessRequest.deleteMany({ email: TEST_EMAIL_PATTERN });
  await User.deleteMany({ email: TEST_EMAIL_PATTERN });
  console.log('Verification complete.');
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await Promise.all([AccessRequest.db.close(), User.db.close()]);
    } catch {
      // ignore close errors during teardown
    }
  });
