const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const AUTH_STORAGE_KEY = 'lpms_auth';

export function getStoredAuth() {
  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(value) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function apiRequest(path, options = {}) {
  const storedAuth = getStoredAuth();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false && storedAuth?.token) {
    headers.set('Authorization', `Bearer ${storedAuth.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body:
      options.body && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof payload === 'object' && payload?.message ? payload.message : 'Request failed.',
    );
    error.status = response.status;
    error.code = typeof payload === 'object' ? payload?.code : undefined;
    throw error;
  }

  return payload;
}

export function submitAccessRequest(body) {
  return apiRequest('/access-requests', {
    method: 'POST',
    auth: false,
    body,
  });
}

export function loginUser(body) {
  return apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body,
  });
}

export function getCurrentUser() {
  return apiRequest('/auth/me');
}

export function changePassword(body) {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body,
  });
}

export function requestPasswordReset(body) {
  return apiRequest('/auth/request-password-reset', {
    method: 'POST',
    auth: false,
    body,
  });
}

export function resetPassword(body) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body,
  });
}

export function getAdminAccessRequests(status = 'pending') {
  return apiRequest(`/admin/access-requests?status=${encodeURIComponent(status)}`);
}

export function approveAccessRequest(requestId) {
  return apiRequest(`/admin/access-requests/${requestId}/approve`, {
    method: 'POST',
  });
}

export function rejectAccessRequest(requestId, body) {
  return apiRequest(`/admin/access-requests/${requestId}/reject`, {
    method: 'POST',
    body,
  });
}

export function resendCredentials(requestId) {
  return apiRequest(`/admin/access-requests/${requestId}/resend-credentials`, {
    method: 'POST',
  });
}
