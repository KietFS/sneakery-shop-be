import express from "express";
import {
  addToFavouriteProduct,
  getFavouriteProduct,
  removeFromFavouriteProduct,
} from "../controllers/FavouriteProduct";
const router = express.Router();

// define the about route
router.post("/:productId", addToFavouriteProduct);
router.delete("/:productId", removeFromFavouriteProduct);
router.get("/", getFavouriteProduct);

module.exports = router;
