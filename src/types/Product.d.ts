import express from "express";
import { IProductSize } from "../entities/Product";

type CreateProductPayload = express.Request<
  any,
  any,
  {
    name: string;
    category: string;
    thumbnail: string;
    price: number;
    description?: string;
    images?: string[];
    brand?: string;
    sizes?: IProductSize[];
  }
>;
