export function serializeUser(userDocument) {
  return {
    id: userDocument._id.toString(),
    name: userDocument.name,
    email: userDocument.email,
    phone: userDocument.phone,
    organization: userDocument.organization || '',
    role: userDocument.role,
    isActive: userDocument.isActive,
    mustChangePassword: userDocument.mustChangePassword,
    tempPasswordExpiresAt: userDocument.tempPasswordExpiresAt,
    lastPasswordChangedAt: userDocument.lastPasswordChangedAt,
    approvedAt: userDocument.approvedAt,
    createdAt: userDocument.createdAt,
    updatedAt: userDocument.updatedAt,
  };
}

export function serializeAccessRequest(requestDocument) {
  return {
    id: requestDocument._id.toString(),
    name: requestDocument.name,
    email: requestDocument.email,
    phone: requestDocument.phone,
    organization: requestDocument.organization || '',
    query: requestDocument.query || '',
    status: requestDocument.status,
    rejectionReason: requestDocument.rejectionReason || '',
    reviewedAt: requestDocument.reviewedAt,
    createdAt: requestDocument.createdAt,
    updatedAt: requestDocument.updatedAt,
    reviewedBy: requestDocument.reviewedBy
      ? {
          id: requestDocument.reviewedBy._id.toString(),
          name: requestDocument.reviewedBy.name,
          email: requestDocument.reviewedBy.email,
        }
      : null,
    approvedUser: requestDocument.approvedUser
      ? {
          id: requestDocument.approvedUser._id.toString(),
          email: requestDocument.approvedUser.email,
          name: requestDocument.approvedUser.name,
          mustChangePassword: requestDocument.approvedUser.mustChangePassword,
          tempPasswordExpiresAt: requestDocument.approvedUser.tempPasswordExpiresAt,
        }
      : null,
    credentialDelivery: requestDocument.credentialDelivery
      ? {
          status: requestDocument.credentialDelivery.status,
          attempts: requestDocument.credentialDelivery.attempts,
          lastAttemptAt: requestDocument.credentialDelivery.lastAttemptAt,
          lastSentAt: requestDocument.credentialDelivery.lastSentAt,
          lastError: requestDocument.credentialDelivery.lastError || '',
          lastMessageId: requestDocument.credentialDelivery.lastMessageId || '',
          history: Array.isArray(requestDocument.credentialDelivery.history)
            ? requestDocument.credentialDelivery.history.map((entry) => ({
                status: entry.status,
                triggeredBy: entry.triggeredBy
                  ? {
                      id: entry.triggeredBy._id?.toString?.() || entry.triggeredBy.toString(),
                      name: entry.triggeredBy.name,
                      email: entry.triggeredBy.email,
                    }
                  : null,
                note: entry.note || '',
                messageId: entry.messageId || '',
                error: entry.error || '',
                sentAt: entry.sentAt,
              }))
            : [],
        }
      : {
          status: 'not_sent',
          attempts: 0,
          lastAttemptAt: null,
          lastSentAt: null,
          lastError: '',
          lastMessageId: '',
          history: [],
        },
  };
}


// export function serializeUser(userDocument) {
//   return {
//     id: userDocument._id.toString(),
//     name: userDocument.name,
//     email: userDocument.email,
//     phone: userDocument.phone,
//     organization: userDocument.organization || '',
//     role: userDocument.role,
//     isActive: userDocument.isActive,
//     mustChangePassword: userDocument.mustChangePassword,
//     tempPasswordExpiresAt: userDocument.tempPasswordExpiresAt,
//     lastPasswordChangedAt: userDocument.lastPasswordChangedAt,
//     approvedAt: userDocument.approvedAt,
//     createdAt: userDocument.createdAt,
//     updatedAt: userDocument.updatedAt,
//   };
// }

// export function serializeAccessRequest(requestDocument) {
//   return {
//     id: requestDocument._id.toString(),
//     name: requestDocument.name,
//     email: requestDocument.email,
//     phone: requestDocument.phone,
//     organization: requestDocument.organization || '',
//     status: requestDocument.status,
//     rejectionReason: requestDocument.rejectionReason || '',
//     reviewedAt: requestDocument.reviewedAt,
//     createdAt: requestDocument.createdAt,
//     updatedAt: requestDocument.updatedAt,
//     reviewedBy: requestDocument.reviewedBy
//       ? {
//           id: requestDocument.reviewedBy._id.toString(),
//           name: requestDocument.reviewedBy.name,
//           email: requestDocument.reviewedBy.email,
//         }
//       : null,
//     approvedUser: requestDocument.approvedUser
//       ? {
//           id: requestDocument.approvedUser._id.toString(),
//           email: requestDocument.approvedUser.email,
//           name: requestDocument.approvedUser.name,
//           mustChangePassword: requestDocument.approvedUser.mustChangePassword,
//           tempPasswordExpiresAt: requestDocument.approvedUser.tempPasswordExpiresAt,
//         }
//       : null,
//     credentialDelivery: requestDocument.credentialDelivery
//       ? {
//           status: requestDocument.credentialDelivery.status,
//           attempts: requestDocument.credentialDelivery.attempts,
//           lastAttemptAt: requestDocument.credentialDelivery.lastAttemptAt,
//           lastSentAt: requestDocument.credentialDelivery.lastSentAt,
//           lastError: requestDocument.credentialDelivery.lastError || '',
//           lastMessageId: requestDocument.credentialDelivery.lastMessageId || '',
//           history: Array.isArray(requestDocument.credentialDelivery.history)
//             ? requestDocument.credentialDelivery.history.map((entry) => ({
//                 status: entry.status,
//                 triggeredBy: entry.triggeredBy
//                   ? {
//                       id: entry.triggeredBy._id?.toString?.() || entry.triggeredBy.toString(),
//                       name: entry.triggeredBy.name,
//                       email: entry.triggeredBy.email,
//                     }
//                   : null,
//                 note: entry.note || '',
//                 messageId: entry.messageId || '',
//                 error: entry.error || '',
//                 sentAt: entry.sentAt,
//               }))
//             : [],
//         }
//       : {
//           status: 'not_sent',
//           attempts: 0,
//           lastAttemptAt: null,
//           lastSentAt: null,
//           lastError: '',
//           lastMessageId: '',
//           history: [],
//         },
//   };
// }
