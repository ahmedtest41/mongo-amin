const Comment = require("../models/Comment");

/** =============================
 * @desc  Add new comment
 * @route  /api/videos/:videoId/comments
 * @method  POST
=============================*/
const addNewComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { user, text } = req.body;
    const newComment = await Comment.create({ videoId, user, text });
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding new comment" });
  }
};

/** =============================
 * @desc  Get all comments for a video
 * @route  /api/videos/:videoId/comments
 * @method  GET
=============================*/
const getCommentsForSingleVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};

/** =============================
 * @desc  Add reply to a comment
 * @route  /api/comments/:commentId/reply
 * @method  POST
=============================*/
const replyToComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.replies.push({ user, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding reply" });
  }
};

/** =============================
 * @desc  Like a comment or reply
 * @route  /api/comments/:commentId/like
 * @method  PATCH
=============================*/
const likeComment = async (req, res) => {
  try {
    const { replyId } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (replyId) {
      const reply = comment.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }
      // Toggle like status
      reply.likes = reply.likes ? reply.likes + 1 : 1;
    } else {
      // Toggle like status
      comment.likes = comment.likes ? comment.likes + 1 : 1;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error liking comment or reply" });
  }
};

module.exports = {
  addNewComment,
  getCommentsForSingleVideo,
  replyToComment,
  likeComment,
};
