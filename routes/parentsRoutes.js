const express = require("express");
const router = express.Router();

const { authUser } = require("../controllers/parentsControllers");

router.post("/", authUser);

module.exports = router;
