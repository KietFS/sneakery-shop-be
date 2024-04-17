import mongoose, { Schema, Document } from "mongoose";

// Define Mongoose schema for the Order entity
export interface IComment extends Document {
  productId: string;
  comments: ICommentItem[];
}

export interface ICommentItem {
  user: string;
  comment: string;
}

const commentItemSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: false },
});

const commentSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  comments: [{ type: commentItemSchema, require: false }],
  // Add other fields as needed
});

// Create the Order model
export const Comment = mongoose.model<IComment>("Comment", commentSchema);
