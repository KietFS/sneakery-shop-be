import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the Order entity
export interface IFavouriteProduct extends Document {
  productId: string;
  rate: number;
  totalRate: number;
}

const favouriteProductSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  // Add other fields as needed
});

// Create the Order model
export const FavouriteProduct = mongoose.model<IFavouriteProduct>(
  "FavouriteProduct",
  favouriteProductSchema
);
