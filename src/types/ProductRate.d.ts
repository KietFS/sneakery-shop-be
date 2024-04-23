import express from "express";
import { IOrder } from "../../entities/Order";
import { IProductRate } from "../../entities/ProductRate";

type CreateProductRatePayload = express.Request<any, any, IProductRate>;