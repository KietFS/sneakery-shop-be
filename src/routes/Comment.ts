import express from "express";
import { createComment, getComments } from "../controllers/Comment";
import { ensureUser } from "src/middlewares";
const router = express.Router();

// define the about route
router.get("/:productId", getComments);
router.post("/:productId", ensureUser, createComment);

module.exports = router;
