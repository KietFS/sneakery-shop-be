import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the User entity
export interface IOTP extends Document {
  userId: string;
  otp: string;
}

const otpSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  otp: { type: String, require: true, unique: true },
});

// Create the User model
export const OTP = mongoose.model<IOTP>("OTP", otpSchema);
