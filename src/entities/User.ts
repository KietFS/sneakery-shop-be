import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "shopper";

// Define Mongoose schema for the User entity
export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  isVerified: boolean;
  rewardPoints?: number;
  role?: UserRole;
  isActive?: boolean;
  deviceId?: string;

  // Add other fields as needed
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: false },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false },
  phoneNumber: { type: String, require: false, unique: false },
  address: { type: String, require: false, unique: false },
  isVerified: { type: Boolean, require: true, unique: false },
  rewardPoints: { type: Number, require: false },
  role: {
    type: String,
    require: false,
    enum: ["admin", "shopper"],
    default: "shopper",
  },
  isActive: { type: Boolean, require: false, default: true },
  deviceId: { type: String, require: false, unique: true },
  // Define other fields as needed, such as role, isActive, etc.
});

// Create the User model
export const User = mongoose.model<IUser>("User", userSchema);
