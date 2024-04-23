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
  | "new"
  | "received"
  | "processing"
  | "shipping"
  | "finished"
  | "canceled";

export type PaymentType = "cod" | "e-wallet";

const orderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Cart", required: true }],
    status: {
      type: String,
      enum: [
        "new",
        "received",
        "processing",
        "shipping",
        "finished",
        "canceled",
      ],
      default: "new",
    },
    totalPrice: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["cod", "e-wallet"],
      default: "cod",
      require: false,
    },

    // Add other fields as needed
  },
  { timestamps: true }
);

// Create the Order model
export const Order = mongoose.model<IOrder>("Order", orderSchema);
