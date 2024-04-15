import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the User entity
export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  isVerified: boolean;

  // Add other fields as needed
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: false },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false },
  phoneNumber: { type: String, require: false, unique: false },
  address: { type: String, require: false, unique: false },
  isVerified: { type: Boolean, require: true, unique: false },
  // Define other fields as needed
});

// Create the User model
export const User = mongoose.model<IUser>("User", userSchema);
