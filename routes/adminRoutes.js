const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminControllers");

router.post("/", loginAdmin);

module.exports = router;
