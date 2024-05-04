import express from "express";
import {
  createOrder,
  getOrderByUser,
  getOrderDetail,
  cancelOrder,
  rateOrder,
} from "../controllers/Order";
const router = express.Router();

// define the about route
router.get("/", getOrderByUser);
router.post("/", createOrder);
router.get("/:orderId", getOrderDetail);
router.post("/rate/:orderId", rateOrder);
router.put("/cancel/:orderId", cancelOrder);

module.exports = router;
