const express = require("express");
const router = express.Router();
const {
  uploadStudents,
  getStudents,
  updateStudents,
  deleteStudents,
  deleteStudentsByGrade,
} = require("../controllers/studentControllers");

router.post("/", uploadStudents);
router.get("/", getStudents);
router.post("/update-students", updateStudents);
router.delete("/", deleteStudents);
router.post("/delete-group", deleteStudentsByGrade);

module.exports = router;
