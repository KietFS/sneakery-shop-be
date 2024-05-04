import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define Mongoose schema for the User entity
export interface ICart extends Document {
  userId: string;
  productId: string;
  quantity: number;
  size: number;
  price: number;
  isVisible?: boolean;
  // Add other fields as needed
}

const cartSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: false },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: false,
    ref: "Product", // ref to product
  },
  quantity: { type: Number, require: true, unique: false },
  size: { type: Number, require: true, unique: false },
  price: { type: Number, require: true, unique: false },
  isVisible: { type: Boolean, require: false, default: true },
});

// Create the User model
export const Cart = mongoose.model<ICart>("Cart", cartSchema);
