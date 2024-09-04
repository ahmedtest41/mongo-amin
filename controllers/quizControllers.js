const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

/** =============================
 * @desc  Add new quiz
 * @route  /api/quizzes
 * @method  POST
=============================*/
const addNewQuiz = async (req, res) => {
  try {
    const { title, grad, questions, duration } = req.body;
    const quiz = new Quiz({ title, grad, questions, duration });
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

/** =============================
 * @desc  Get all quizzes with students' results
 * @route  /api/quizzes
 * @method  GET
=============================*/
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const quizzesWithResults = await Promise.all(
      quizzes.map(async (quiz) => {
        const results = await Result.find({ quizId: quiz._id }).select(
          "studentName studentEmail score"
        );
        return {
          ...quiz._doc,
          results,
        };
      })
    );
    res.status(200).json({ quizzes: quizzesWithResults });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

/** =============================
 * @desc  Get quiz by ID
 * @route  /api/quizzes/:id
 * @method  GET
=============================*/
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

/** =============================
 * @desc  Get students' results for a specific quiz by ID
 * @route  /api/quizzes/:id/students
 * @method  GET
=============================*/
const getStudentsByQuizId = async (req, res) => {
  try {
    const quizId = req.params.id;
    const results = await Result.find({ quizId }).select(
      "studentName studentEmail score"
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

/** =============================
 * @desc  Submit quiz answers
 * @route  /api/quizzes/:id/submit
 * @method  POST
=============================*/
const submitQuiz = async (req, res) => {
  try {
    const { answers, name, email, grad, code } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let incorrectQuestions = [];

    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
        correctAnswers++;
      } else {
        incorrectAnswers++;
        incorrectQuestions.push({
          questionText: question.questionText,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
          selectedAnswer: answers[index],
        });
      }
    });

    const result = new Result({
      studentName: name,
      studentEmail: email,
      studentGrad: grad,
      code: code,
      quizId: quiz._id,
      score,
      correctAnswers,
      incorrectAnswers,
      numberOfQuestions: quiz.questions.length,
      incorrectQuestions, // إضافة الأسئلة الخاطئة
    });

    await result.save();

    res.status(200).json({
      message: "Quiz submitted",
      resultId: result._id,
      score,
      correctAnswers,
      incorrectAnswers,
      numberOfQuestions: quiz.questions.length,
      name,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error });
  }
};

module.exports = {
  addNewQuiz,
  getAllQuizzes,
  getQuizById,
  getStudentsByQuizId,
  submitQuiz,
};
