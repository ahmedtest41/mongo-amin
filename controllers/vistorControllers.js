const express = require("express");
const Vistor = require("../models/Vistor");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const dotenv = require("dotenv");
dotenv.config();

/** =============================
 * @desc  Add new vistor
 * @route  /api/vistors
 * @method  POST
=============================*/
const registerNewVistor = async (req, res, next) => {
  const { username, phone, parentPhone, payPhone, grade, time, type } =
    req.body;

  // Data of image
  const image = req.file ? req.file.filename : null;
  const imageName = req.file.filename;
  const imagePath = path.join(__dirname, `../uploads/${imageName}`);

  // Upload image to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);

  try {
    const vistor = await Vistor.create({
      username,
      phone,
      parentPhone,
      payPhone,
      grade,
      gradeAr:
        grade == "1prep"
          ? "الأول الإعدادي"
          : grade == "2prep"
          ? "الثاني الإعدادي"
          : grade == "3prep"
          ? "الثالث الإعدادي"
          : grade == "1sec"
          ? "الأول الثانوي"
          : grade == "2sec"
          ? "الثاني الثانوي"
          : grade == "3sec"
          ? "الثالث الثانوي"
          : "",
      time,
      type,
      typeAr: type === "centre" ? "سنتر" : type === "online" ? "أونلاين" : "",
      image: result.secure_url,
    });

    jwt.sign(
      { vistorId: vistor._id, username },
      process.env.JWT_SECRET,
      { expiresIn: "90d" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: false,
            maxAge: 90 * 24 * 60 * 60 * 1000,
          })
          .status(201)
          .json({ id: vistor._id, token });
      }
    );

    fs.unlinkSync(imagePath);
    res.status(201).json(vistor);
  } catch (error) {
    next(error);
  }
};

/** =============================
  * @desc  Get vistor profile
  * @route  /api/vistors
  * @method  GET
=============================*/
const getVistorProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vistor = await Vistor.findById(id);

    if (!vistor) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.status(200).json(vistor);
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدم:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات المستخدم" });
  }
};

/** =============================
  * @desc  Get all vistors
  * @route  /api/vistors
  * @method  GET
=============================*/
const getVistors = async (req, res, next) => {
  const vistors = await Vistor.find();
  res.json(vistors);
};

/** =============================
 * @desc  Update vistor check status
 * @route  /api/vistors/:id
 * @method  PATCH
=============================*/
const updateVistorCheck = async (req, res, next) => {
  const vistorId = req.params.id;
  const { check } = req.body;

  try {
    const updatedVistor = await Vistor.findByIdAndUpdate(
      vistorId,
      { check },
      { new: true }
    );

    if (!updatedVistor) {
      return res.status(404).json({ message: "Vistor not found..!" });
    }

    res.status(200).json(updatedVistor);
  } catch (error) {
    console.error("Error updating vistor:", error);
    res.status(500).json({ message: "Error updating vistor" });
  }
};

/** =============================
 * @desc  Delete vistor
 * @route  /api/vistors/:id
 * @method  DELETE
=============================*/
const deleteVistor = async (req, res, next) => {
  try {
    const vistorId = req.params.id;
    const deletedVistor = await Vistor.findByIdAndDelete(vistorId);
    if (!deletedVistor) {
      return res.status(404).json({ message: "Vistor not found..!" });
    }
    await cloudinaryRemoveImage(deletedVistor.image);
    res.status(200).json({ message: "Vistor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vistor:", error);
    res.status(500).json({ message: "Error deleting vistor" });
  }
};

module.exports = {
  registerNewVistor,
  getVistors,
  getVistorProfile,
  updateVistorCheck,
  deleteVistor,
};
