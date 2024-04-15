import express from "express";
import { IOrder } from "../../entities/Order";

type CreateOrderPayload = express.Request<any, any, IOrder>;
