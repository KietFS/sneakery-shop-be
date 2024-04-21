import express from "express";
import {
  addToFavouriteProduct,
  removeFromFavouriteProduct,
} from "../controllers/FavouriteProduct";
const router = express.Router();

// define the about route
router.post("/:productId", addToFavouriteProduct);
router.delete("/:productId", removeFromFavouriteProduct);

module.exports = router;
