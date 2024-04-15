import express from "express";
import { createOrder, getOrderByUser } from "../controllers/Order";
const router = express.Router();

// define the about route
router.get("/", () => {});
router.post("/", () => []);
router.get("/:couponId", () => {});

module.exports = router;
