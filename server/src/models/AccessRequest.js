import mongoose from 'mongoose';

const accessRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    credentialDelivery: {
      status: {
        type: String,
        enum: ['not_sent', 'sent', 'failed'],
        default: 'not_sent',
      },
      attempts: {
        type: Number,
        default: 0,
      },
      lastAttemptAt: {
        type: Date,
        default: null,
      },
      lastSentAt: {
        type: Date,
        default: null,
      },
      lastError: {
        type: String,
        default: '',
      },
      lastMessageId: {
        type: String,
        default: '',
      },
      history: [
        {
          status: {
            type: String,
            enum: ['sent', 'failed'],
            required: true,
          },
          triggeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
          },
          note: {
            type: String,
            default: '',
          },
          messageId: {
            type: String,
            default: '',
          },
          error: {
            type: String,
            default: '',
          },
          sentAt: {
            type: Date,
            default: null,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

accessRequestSchema.index({ email: 1, status: 1 });

export const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
