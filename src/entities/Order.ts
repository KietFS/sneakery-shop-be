import mongoose, { Schema, Document, Types } from "mongoose";
import { ICart } from "./Cart";
import { timeStamp } from "console";

// Define Mongoose schema for the Order entity
export interface IOrder extends Document {
  userId: string;
  items: Types.Array<ICart["_id"]>;
  status: OrderStatusEnum;
  totalPrice: number;
}

// Define OrderStatusEnum
export type OrderStatusEnum =
  | "received"
  | "processing"
  | "shipping"
  | "finished";

const orderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Cart", required: true }],
    status: {
      type: String,
      enum: ["received", "processing", "shipping", "finished"],
      default: "received",
    },
    totalPrice: { type: Number, required: true },

    // Add other fields as needed
  },
  { timestamps: true }
);

// Create the Order model
export const Order = mongoose.model<IOrder>("Order", orderSchema);
