import express from "express";
import {
  createCart,
  getCartDetail,
  getCarts,
  removeCartItem,
} from "../controllers/Cart";
import { ensureUser } from "src/middlewares";
const router = express.Router();

// define the about route
router.get("/", ensureUser, getCarts as any);
router.post("/", ensureUser, createCart as any);
router.get("/:cartId", ensureUser, getCartDetail as any);
router.delete("/:cartId", ensureUser, removeCartItem as any);

module.exports = router;
