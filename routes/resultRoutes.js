// routes/resultRoutes.js
const express = require("express");
const {
  getResult,
  getResultsByStudent,
} = require("../controllers/resultControllers");
const router = express.Router();

router.get("/:id", getResult);
router.get("/student/:code", getResultsByStudent);

module.exports = router;
