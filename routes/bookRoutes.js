const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addNewBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
} = require("../controllers/bookControllers");
const mixUpload = require("../middlewares/mixUpload");

router.post(
  "/",
  mixUpload.fields([
    { name: "book", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addNewBook
);
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.delete("/:id", deleteBook);

module.exports = router;
