import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now, // Set default to current date
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to false, indicating the user is not verified
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationExpiresAt: Date,
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

export const User = mongoose.model("User", userSchema);