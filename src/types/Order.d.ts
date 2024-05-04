import express from "express";
import { IOrder } from "../../entities/Order";
import { OrderStatusEnum } from "../entities/Order";

type CreateOrderPayload = express.Request<any, any, IOrder>;

type UpdateStatusOrderPayload = express.Request<
  any,
  any,
  { status: OrderStatusEnum }
>;

type RateProductPayload = express.Request<
  any,
  any,
  {
    rate: number;
  }
>;
