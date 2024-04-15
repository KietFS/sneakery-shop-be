import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the Coupon entity
export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  minPurchaseAmount: number;
  // Add other fields as needed
}

const couponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  minPurchaseAmount: { type: Number, required: true },
});

// Create the Coupon model
export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
