import express from "express";
import { ICart } from "../entities/Cart";

type CreateCartPayload = express.Request<
  any,
  any,
  Omit<ICart, "userId", "price">
>;

interface ICartResponse extends Omit<ICart, "userId"> {}
