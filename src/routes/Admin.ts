import express from "express";
import {
  getUsers,
  loginAdmin,
  activateUser,
  deActivateUser,
} from "../controllers/User";
import {
  changeStatusOrder,
  deleteOrder,
  getAllOrder,
} from "../controllers/Order";
import {
  createProduct,
  getProducts,
  getTenMostPopularProducts,
  removeProduct,
  updateProduct,
} from "../controllers/Product";
import { ensureAdmin } from "../middlewares";
const router = express.Router();

// define the Admin routes
router.post("/login", loginAdmin);
router.get("/orders", ensureAdmin, getAllOrder);
router.get("/users", ensureAdmin, getUsers);
router.put("/users/activate/:userId", ensureAdmin, activateUser);
router.put("/users/deactivate/:userId", ensureAdmin, deActivateUser);
router.get("/products", getProducts);
router.post("/products", ensureAdmin, createProduct);
router.put("/products/:productId", ensureAdmin, updateProduct);
router.get("/products/:productId", ensureAdmin, getProducts);
router.put("/orders/:orderId", ensureAdmin, changeStatusOrder);
router.delete("/orders/:orderId", ensureAdmin, deleteOrder);
router.delete("/products/:productId", ensureAdmin, removeProduct);
router.get("/products/popular", getTenMostPopularProducts);

module.exports = router;
