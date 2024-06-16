import express from "express";
import { ICart } from "../entities/Cart";
import { IComment } from "../../entities/Comments";

export interface CreateCommentPayload
  extends express.Request<any, any, { content: string }> {
  userInfo: any;
}
