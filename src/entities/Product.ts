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
  rate?: number;
  totalRate?: number;
  totalComment?: number;
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
  buyTime: { type: Number, require: false },
  rate: { type: Number, require: false },
  totalRate: { type: Number, require: false },
  totalComment: { type: Number, require: false },
});

// Create the Product model
export const Product = mongoose.model<IProduct>("Product", productSchema);
