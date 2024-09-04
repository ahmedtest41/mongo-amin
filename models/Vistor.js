const mongoose = require("mongoose");

const vistorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    payPhone: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    gradeAr: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    typeAr: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Vistor = mongoose.model("Vistor", vistorSchema);

module.exports = Vistor;
