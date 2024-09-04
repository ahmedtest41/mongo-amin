const express = require("express");
const Degree = require("../models/Degree");
const generateToken = require("../utils/generateToken");

/** =============================
 * @desc  Auth user token
 * @route  /api/users/auth
 * @method  POST
=============================*/
const authUser = async (req, res, next) => {
  const { code, email, password } = req.body;
  const student = await Degree.findOne({ code });

  if (student) {
    const token = generateToken(student._id);
    return res.status(201).json(student);
  } else {
    return res.status(401).json({ message: "Invalid code or password" });
  }
};

module.exports = {
  authUser,
};
