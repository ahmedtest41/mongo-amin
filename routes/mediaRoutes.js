const express = require("express");
const router = express.Router();
const {
  addNewMedia,
  getAllMedia,
  getSingleMedia,
  deleteMedia,
} = require("../controllers/mediaControllers");
const imageUpload = require("../middlewares/imageUpload");

router.post("/", imageUpload.single("image"), addNewMedia);
router.get("/", getAllMedia);
router.get("/:id", getSingleMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
