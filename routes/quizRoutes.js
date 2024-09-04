const express = require("express");
const router = express.Router();
const {
  addNewQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getStudentsByQuizId,
} = require("../controllers/quizControllers");

router.post("/", addNewQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/submit", submitQuiz);
router.get("/:id/students", getStudentsByQuizId);

module.exports = router;
