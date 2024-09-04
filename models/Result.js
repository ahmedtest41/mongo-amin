const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  studentGrad: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  incorrectAnswers: {
    type: Number,
    required: true,
  },
  numberOfQuestions: {
    type: Number,
    required: true,
  },
  incorrectQuestions: [
    {
      questionText: String,
      choices: [String],
      correctAnswer: Number,
      selectedAnswer: Number,
    },
  ],
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
