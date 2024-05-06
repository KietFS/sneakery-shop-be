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
import { validateIsAdmin } from "../middlewares";
const router = express.Router();

// define the Admin routes
router.post("/login", loginAdmin);
router.get("/orders", validateIsAdmin, getAllOrder);
router.get("/users", validateIsAdmin, getUsers);
router.put("/users/activate/:userId", validateIsAdmin, activateUser);
router.put("/users/deactivate/:userId", validateIsAdmin, deActivateUser);
router.get("/products", getProducts);
router.post("/products", validateIsAdmin, createProduct);
router.put("/products/:productId", validateIsAdmin, updateProduct);
router.get("/products/:productId", validateIsAdmin, getProducts);
router.put("/orders/:orderId", validateIsAdmin, changeStatusOrder);
router.delete("/orders/:orderId", validateIsAdmin, deleteOrder);
router.delete("/products/:productId", validateIsAdmin, removeProduct);
router.get("/products/popular", getTenMostPopularProducts);

module.exports = router;
