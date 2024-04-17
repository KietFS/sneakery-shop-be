import express from "express";
import {
  createProduct,
  getProductDetail,
  getProducts,
  updateSizes,
} from "../controllers/Product";
import { validateFieldPayload } from "../middlewares";
const router = express.Router();

// define the about route
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:productId", getProductDetail);
router.get("/updateSize", updateSizes);

module.exports = router;
