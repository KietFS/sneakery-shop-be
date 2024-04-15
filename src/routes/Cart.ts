import express from "express";
import {
  createCart,
  getCartDetail,
  getCarts,
  removeCartItem,
} from "../controllers/Cart";
const router = express.Router();

// define the about route
router.get("/", getCarts);
router.post("/", createCart);
router.get("/:cartId", getCartDetail);
router.delete("/:cartId", removeCartItem);

module.exports = router;
