const express = require("express");
const router = express.Router();

const {
  uploadDegrees,
  updateDegrees,
  getDegrees,
  deleteDegrees,
} = require("../controllers/degreeControllers");

router.post("/", uploadDegrees);
router.post("/update-degrees", updateDegrees);
router.get("/", getDegrees);
router.delete("/", deleteDegrees);

module.exports = router;
