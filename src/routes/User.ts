import express from "express";
import {
  editUser,
  getUserDetail,
  getUsers,
  loginUser,
  registerUser,
  verifyUserOTP,
} from "../controllers/User";
const router = express.Router();

// define the about route
router.get("/", getUsers);
router.get("/:userId", getUserDetail);
router.post("/register", registerUser);
router.post("/verifyOTP/:userId", verifyUserOTP);
router.put("/", editUser);
router.post("/login", loginUser);

module.exports = router;
