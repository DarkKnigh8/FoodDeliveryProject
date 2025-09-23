// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['customer', 'restaurant', 'admin','delivery'], 
//     default: 'customer'
//   }
// }, { timestamps: true });

// export default mongoose.model('User', userSchema);

// src/models/User.js
import mongoose from 'mongoose';

const identitySchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },            // e.g., 'google', 'wso2'
    providerId: { type: String, required: true, index: true }, // sub (subject) from IdP
    email: String,
    emailVerified: Boolean,
    picture: String,
    lastLoginAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // This remains your canonical email (can be the same as provider email)
    email: { type: String, required: true, unique: true },
    // Make password optional to support OAuth-only users
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['customer', 'restaurant', 'admin', 'delivery'],
      default: 'customer',
    },
    identities: {
      type: [identitySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Unique index for provider+providerId (prevents duplicates)
userSchema.index(
  { 'identities.provider': 1, 'identities.providerId': 1 },
  { unique: true, sparse: true }
);

export default mongoose.model('User', userSchema);
