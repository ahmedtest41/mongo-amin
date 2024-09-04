const mongoose = require("mongoose");

const studentchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
    },
    code: {
      type: String,
    },
    name: {
      type: String,
    },
    grad: {
      type: String,
    },
    time: {
      type: String,
    },
    phone: {
      type: String,
    },
    parentPhone: {
      type: String,
    },
    adress: {
      type: String,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentchema);

module.exports = Student;
