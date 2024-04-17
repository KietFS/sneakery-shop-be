import express from "express";
import { ICart } from "../entities/Cart";
import { IComment } from "../../entities/Comments";

type CreateCommentPayload = express.Request<any, any, { content: string }>;
