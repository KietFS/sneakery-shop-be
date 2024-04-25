import express from "express";
import {
  getUsers,
  loginAdmin,
} from "../controllers/User";
import { changeStatusOrder, getAllOrder } from "../controllers/Order";
import { getProducts } from "../controllers/Product";
import { validateIsAdmin } from "../middlewares";
const router = express.Router();

// define the Admin routes
router.post("/login", loginAdmin);
router.get('/orders',validateIsAdmin, getAllOrder)
router.get('/users',validateIsAdmin , getUsers)
router.get('/products', getProducts)
router.put('/orders/:orderId',validateIsAdmin, changeStatusOrder)

module.exports = router;