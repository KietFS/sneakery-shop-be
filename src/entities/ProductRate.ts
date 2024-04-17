import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the Order entity
export interface IProductRate extends Document {
  productId: string;
  rate: number;
  totalRate: number;
}

const productRateSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  rate: { type: Number, required: true },
  totalRate: { type: Number, required: true },
  // Add other fields as needed
});

// Create the Order model
export const ProductRate = mongoose.model<IProductRate>(
  "ProductRate",
  productRateSchema
);
