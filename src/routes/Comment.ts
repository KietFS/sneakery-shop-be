import express from "express";
import { createComment, getComments } from "../controllers/Comment";
const router = express.Router();

// define the about route
router.get("/:productId", getComments);
router.post("/:productId", createComment);

module.exports = router;
