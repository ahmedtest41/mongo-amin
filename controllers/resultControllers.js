const mongoose = require("mongoose");
const Result = require("../models/Result");

const getResult = async (req, res) => {
  try {
    const resultId = req.params.id;

    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const result = await Result.findById(resultId).populate("quizId"); // جلب البيانات الخاصة بـ quizId أيضاً
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: "Error fetching result", error });
  }
};

const getResultsByStudent = async (req, res) => {
  console.log(req.params.code);
  try {
    const studentCode = req.params.code; // استخدام كود الطالب من الطلب

    const results = await Result.find({ code: studentCode }).populate("quizId");
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Error fetching results", error });
  }
};

module.exports = {
  getResult,
  getResultsByStudent,
};
