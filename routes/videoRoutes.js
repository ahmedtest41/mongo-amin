const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addNewVideo,
  getAllVideos,
  getSingleVideo,
  deleteVideo,
} = require("../controllers/videoControllers");

router.post("/", addNewVideo);
router.get("/", getAllVideos);
router.get("/:id", getSingleVideo);
router.delete("/:id", deleteVideo);

module.exports = router;
