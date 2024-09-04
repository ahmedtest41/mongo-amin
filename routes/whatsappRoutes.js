const express = require("express");
const router = express.Router();
const { testWhatapp } = require("../controllers/whatsappController");

router.get("/", testWhatapp);

module.exports = router;
