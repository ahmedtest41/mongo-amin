const express = require("express");
const router = express.Router();
const {
  authUser,
  addNewUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const protect = require("../middlewares/auth");

router.post("/", addNewUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/", getAllUsers);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
