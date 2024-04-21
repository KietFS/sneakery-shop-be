import mongoose, { Schema, Document } from "mongoose";

export interface IFavouriteProduct extends Document {
  user: string;
  products: string[];
}

const favouriteProductSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
});

export const FavouriteProduct = mongoose.model<IFavouriteProduct>(
  "FavouriteProduct",
  favouriteProductSchema
);
