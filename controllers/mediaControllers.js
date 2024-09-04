const express = require("express");
const Media = require("../models/Media");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/** =============================
 * @desc  Add new media
 * @route  /api/media
 * @method  POST
=============================*/
const addNewMedia = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Data of image
    const imageName = req.file.filename;
    const imagePath = path.join(__dirname, `../uploads/${imageName}`);

    // Upload image to cloudinary
    const result = await cloudinaryUploadImage(imagePath);

    // Create new meida
    const newMedia = await Media.create({
      title: title,
      image: result.secure_url,
    });

    res.json(newMedia);

    // Delete exam image fron server
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error("Error adding new media:", error);
    res.status(500).json({ message: "Error adding new media" });
  }
};

/** =============================
 * @desc  Get all meida
 * @route  /api/meida
 * @method  GET
  =============================*/
const getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find();
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/** =============================
 * @desc  Get single media
 * @route  /api/media/:id
 * @method  GET
  =============================*/
const getSingleMedia = async (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found..!" });
    }
    return res.status(200).json(media);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

/** =============================
 * @desc  Delete media
 * @route  /api/media/:id
 * @method  DELETE
  =============================*/
const deleteMedia = async (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const deletedMeida = await Media.findByIdAndDelete(mediaId);
    if (!deletedMeida) {
      return res.status(404).json({ message: "Media not found..!" });
    }
    await cloudinaryRemoveImage(deletedMeida.image);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Error deleting media" });
  }
};

module.exports = {
  addNewMedia,
  getAllMedia,
  getSingleMedia,
  deleteMedia,
};
