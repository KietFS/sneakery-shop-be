import express from "express";
import {
  createProduct,
  getProductDetail,
  getProducts,
  rateProduct,
} from "../controllers/Product";
const router = express.Router();

//get all the products
router.get("/", getProducts);

//create a new product
router.post("/", createProduct);

//get product detail
router.get("/:productId", getProductDetail);

//rate a product
router.post("/rate/:productId", rateProduct);

module.exports = router;
