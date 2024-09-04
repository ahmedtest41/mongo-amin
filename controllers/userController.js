const express = require("express");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/** =============================
 * @desc  Auth user token
 * @route  /api/users/auth
 * @method  POST
=============================*/
const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    const token = generateToken(user._id);
    res.cookie("jwt", token);

    // تضمين جميع الحقول المطلوبة بما في ذلك الكود
    const { _id, name, email, phone, grad, code } = user;
    return res.status(201).json({ _id, name, email, phone, grad, code });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

/** =============================
 * @desc  Add new user
 * @route  /api/users
 * @method  POST
=============================*/
const addNewUser = async (req, res, next) => {
  try {
    const { name, email, phone, grad, password, code, type } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      grad,
      code,
      type,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie("jwt", token);
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** =============================
 * @desc  Logout user
 * @route  /api/users/logout
 * @method  POST
=============================*/
const logoutUser = async (req, res, next) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
};

/** =============================
 * @desc  Get user profile
 * @route  /api/users/profile
 * @method  GET
 * @access Private
=============================*/
const getUserProfile = async (req, res, next) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    grad: req.user.grad,
  };
  res.status(200).json(user);
};

/** =============================
 * @desc  Update user profile
 * @route  /api/users/profile
 * @method  PUT
 * @access Private
=============================*/
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/** =============================
 * @desc  Get All users
 * @route  /api/users
 * @method  GET
 * @access Private
=============================*/
const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
};

/** =============================
 * @desc  Forget password
 * @route  /api/users/forget-password
 * @method  POST
=============================*/
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found..!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ahmedsallam121212@gmail.com",
        pass: "aciz jpia admm ewew",
      },
    });

    var mailOptions = {
      from: "caramen5577@gmail.com",
      to: email,
      subject: "اعادة تعيين كملة المرور",
      text: `${process.env.CLIENT_URL}/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "Error sending email" });
      } else {
        return res.json({ message: "Email has been sent succefully..!" });
      }
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** =============================
 * @desc  Reset password
 * @route  /api/users/reset-password/:token
 * @method  POST
=============================*/
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.status(200).json({ message: "Password has been updated..!" });
  } catch (error) {
    return res.json("Invaild token..!");
  }
};

module.exports = {
  authUser,
  addNewUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  forgetPassword,
  resetPassword,
};
