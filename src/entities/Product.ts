import mongoose, { Schema, Document } from "mongoose";

export interface IProductSize {
  size: number;
  quantity: number;
}

// Define Mongoose schema for the Product entity
export interface IProduct extends Document {
  name: string;
  category: string;
  thumbnail: string;
  price: number;
  description?: string;
  images?: string[];
  brand?: string;
  sizes?: IProductSize[];
  buyTime?: number;
  // Add other fields as needed
}

const sizeSchema = new Schema({
  size: { type: Number, required: true, unique: true },
  quantity: { type: Number, required: true },
});

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, require: false },
  images: { type: [String], required: false },
  brand: { type: String, require: false },
  sizes: { type: [sizeSchema], require: false }, // Use sizeSchema here
  buyTime: { type: String, require: false },
});

// Create the Product model
export const Product = mongoose.model<IProduct>("Product", productSchema);
