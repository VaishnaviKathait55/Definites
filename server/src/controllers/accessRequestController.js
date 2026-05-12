import { AccessRequest } from '../models/AccessRequest.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { serializeAccessRequest } from '../utils/serializers.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QUERY_WORDS = 100;

const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

export const createAccessRequest = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const phone = req.body.phone?.trim();
  const organization = req.body.organization?.trim() || '';
  const query = req.body.query?.trim() || '';

  if (!name || !email || !phone) {
    throw new ApiError(400, 'Name, email, and phone are required.', 'VALIDATION_ERROR');
  }

  if (!query) {
    throw new ApiError(400, 'Please provide a query.', 'VALIDATION_ERROR');
  }

  if (countWords(query) > MAX_QUERY_WORDS) {
    throw new ApiError(400, `Query must not exceed ${MAX_QUERY_WORDS} words.`, 'VALIDATION_ERROR');
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new ApiError(400, 'Please enter a valid email address.', 'INVALID_EMAIL');
  }

  const existingUser = await User.findOne({ email, isActive: true });

  if (existingUser) {
    throw new ApiError(409, 'An active account already exists for this email.', 'USER_EXISTS');
  }

  const pendingRequest = await AccessRequest.findOne({ email, status: 'pending' });

  if (pendingRequest) {
    throw new ApiError(409, 'An access request for this email is already pending review.', 'REQUEST_EXISTS');
  }

  const accessRequest = await AccessRequest.create({
    name,
    email,
    phone,
    organization,
    query,
  });

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

// const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export const createAccessRequest = asyncHandler(async (req, res) => {
//   const name = req.body.name?.trim();
//   const email = req.body.email?.trim().toLowerCase();
//   const phone = req.body.phone?.trim();
//   const organization = req.body.organization?.trim() || '';

//   if (!name || !email || !phone) {
//     throw new ApiError(400, 'Name, email, and phone are required.', 'VALIDATION_ERROR');
//   }

//   if (!EMAIL_PATTERN.test(email)) {
//     throw new ApiError(400, 'Please enter a valid email address.', 'INVALID_EMAIL');
//   }

//   const existingUser = await User.findOne({ email, isActive: true });

//   if (existingUser) {
//     throw new ApiError(409, 'An active account already exists for this email.', 'USER_EXISTS');
//   }

//   const pendingRequest = await AccessRequest.findOne({ email, status: 'pending' });

//   if (pendingRequest) {
//     throw new ApiError(409, 'An access request for this email is already pending review.', 'REQUEST_EXISTS');
//   }

//   const accessRequest = await AccessRequest.create({
//     name,
//     email,
//     phone,
//     organization,
//   });

//   res.status(201).json({
//     message: 'Access request submitted successfully. An administrator will review it shortly.',
//     accessRequest: serializeAccessRequest(accessRequest),
//   });
// });
