const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  score: {
    type: String,
    default: "لم يتم تحديد درجة",
  },
  finalScore: {
    type: String,
    default: "لم يتم تحديد درجة",
  },
  minScoreToRetake: {
    type: String,
    default: "لم يتم تحديد درجة",
  },
  examDate: {
    type: Date,
    default: null,
  },
});

const degreeSchema = new mongoose.Schema(
  {
    degreeId: {
      type: String,
    },
    code: {
      type: String,
    },
    name: {
      type: String,
    },
    time: {
      type: String,
    },
    payment: {
      type: String,

      default: "لم يتم الدفع",
    },
    lessons: [lessonSchema],
    grad: {
      type: String,
    },
  },
  { timestamps: true }
);

const Degree = mongoose.model("Degree", degreeSchema);

module.exports = Degree;
