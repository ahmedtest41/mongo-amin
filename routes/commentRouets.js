// في ملف routes/comments.js
const express = require("express");
const router = express.Router();
const {
  addNewComment,
  getCommentsForSingleVideo,
  replyToComment,
  likeComment,
} = require("../controllers/commentControllers");

router.post("/videos/:videoId/comments", addNewComment);
router.get("/videos/:videoId/comments", getCommentsForSingleVideo);
router.post("/:commentId/reply", replyToComment);
router.patch("/:commentId/like", likeComment);

module.exports = router;
