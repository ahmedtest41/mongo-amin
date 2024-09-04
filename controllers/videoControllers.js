const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadVideo,
  cloudinaryRemoveVideo,
} = require("../utils/cloudinary");
const Video = require("../models/Video");

/** =============================
 * @desc  Add new video
 * @route  /api/videos
 * @method  POST
=============================*/
const addNewVideo = async (req, res, next) => {
  try {
    const { title, grad, type, videoId } = req.body;

    const newVideo = await Video.create({
      title: title,
      grad: grad,
      type: type,
      videoId: videoId,
    });
    res.json(newVideo);
  } catch (error) {
    console.error("Error adding new video:", error);
    res.status(500).json({ message: "Error adding new video" });
  }
};

/** =============================
 * @desc  Get all videos
 * @route  /api/videos
 * @method  GET
  =============================*/
const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/** =============================
 * @desc  Get single video
 * @route  /api/videos/:id
 * @method  GET
  =============================*/
const getSingleVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found..!" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

/** =============================
 * @desc  Edit board
 * @route  /api/boards/:id
 * @method  PATACH
  =============================*/
const editBoard = async (req, res, next) => {};

/** =============================
 * @desc  Delete video
 * @route  /api/videos/:id
 * @method  DELETE
  =============================*/
const deleteVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Error deleting video" });
  }
};

module.exports = {
  addNewVideo,
  getAllVideos,
  getSingleVideo,
  editBoard,
  deleteVideo,
};
