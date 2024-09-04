const express = require("express");
const router = express.Router();
const {
  addNewReview,
  getAllReviews,
  getSingleReview,
  editReview,
  deleteReview,
} = require("../controllers/reviewControllers");

router.post("/", addNewReview);
router.get("/", getAllReviews);
router.get("/:id", getSingleReview);
router.patch("/:id", editReview);
router.delete("/:id", deleteReview);

module.exports = router;
