const express = require("express");
const Review = require("../models/Review");

/** =============================
 * @desc  Add new review
 * @route  /api/reviews
 * @method  POST
=============================*/

const addNewReview = async (req, res, next) => {
  try {
    const { name, phone, email, message } = req.body;

    // Create new review
    const newReview = await Review.create({
      name: name,
      phone: phone,
      email: email,
      message: message,
    });

    res.json(newReview);
  } catch (error) {
    console.error("Error adding new review:", error);
    res.status(500).json({ message: "Error adding new review" });
  }
};

/** =============================
 * @desc  Get all reviews
 * @route  /api/reviews
 * @method  GET
  =============================*/
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/** =============================
 * @desc  Get single review
 * @route  /api/reviews/:id
 * @method  GET
  =============================*/
const getSingleReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found..!" });
    }
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

/** =============================
 * @desc  Delete review
 * @route  /api/reviews/:id
 * @method  DELETE
  =============================*/
const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found..!" });
    }
    res.status(200).json({ message: "Deleted..!" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
};

/** =============================
 * @desc  Edit review
 * @route  /api/reviews/:id
 * @method  PATCH
  =============================*/
const editReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { approve } = req.body;

    // Check if review exists
    let review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found..!" });
    }

    // Update only the 'approve' field
    review.approve = approve; // Set approve to the value from req.body

    // Save updated review
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Error editing review" });
  }
};

module.exports = {
  addNewReview,
  getAllReviews,
  getSingleReview,
  editReview,
  deleteReview,
};
