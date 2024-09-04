const express = require("express");
const Degree = require("../models/Degree");

const handleLessons = (existingLessons, newLessons) => {
  // دمج أو تحديث الدروس الحالية مع الدروس الجديدة، مع تجاهل القيم الفارغة
  return newLessons.map((newLesson) => {
    const existingLesson = existingLessons.find(
      (lesson) => lesson.lessonId === newLesson.lessonId
    );

    if (existingLesson) {
      // تحديث الحقول فقط إذا كانت القيم الجديدة غير فارغة
      const updatedLesson = { ...existingLesson };

      Object.keys(newLesson).forEach((key) => {
        if (
          newLesson[key] !== "" &&
          newLesson[key] !== null &&
          newLesson[key] !== undefined
        ) {
          updatedLesson[key] = newLesson[key];
        }
      });

      return updatedLesson;
    }

    return newLesson;
  });
};

/** =============================
 * @desc  Upload degrees
 * @route  /api/degrees
 * @method  POST
=============================*/
const uploadDegrees = async (req, res) => {
  try {
    const degrees = req.body;

    if (!Array.isArray(degrees) || degrees.length === 0) {
      return res.status(400).json({ message: "Invalid degrees data." });
    }

    for (const degree of degrees) {
      const { degreeId, code, name, time, payment, lessons, grad } = degree;

      if (!degreeId || !code || !name || !time || !grad) {
        return res
          .status(400)
          .json({ message: "Missing required degree fields." });
      }

      // التحقق إذا كان الطالب موجودًا بالفعل في قاعدة البيانات
      const existingDegree = await Degree.findOne({ code });

      if (existingDegree) {
        // تحديث بيانات الطالب الحالي
        existingDegree.name = name;
        existingDegree.time = time;
        existingDegree.payment = payment;
        existingDegree.grad = grad;
        existingDegree.lessons = handleLessons(existingDegree.lessons, lessons);

        await existingDegree.save();
      } else {
        // إضافة الطالب الجديد
        const newDegree = new Degree({
          degreeId,
          code,
          name,
          time,
          payment,
          grad,
          lessons,
        });

        await newDegree.save();
      }
    }

    res.status(200).json({ message: "Degrees uploaded successfully" });
  } catch (error) {
    console.error("Error uploading degrees:", error);
    res
      .status(500)
      .json({ message: "Failed to upload degrees", error: error.message });
  }
};

/** =============================
 * @desc  Get degrees
 * @route  /api/degrees
 * @method  GET
=============================*/
const getDegrees = async (req, res) => {
  try {
    const degrees = await Degree.find({});
    res.status(200).json(degrees);
  } catch (error) {
    console.error("Error getting degrees:", error);
    res
      .status(500)
      .json({ message: "Error getting degrees", error: error.message });
  }
};

/** =============================
 * @desc  Update degrees
 * @route  /api/degrees/update-degrees
 * @method  POST
=============================*/
const updateDegrees = async (req, res) => {
  try {
    const degrees = req.body;

    if (!Array.isArray(degrees) || degrees.length === 0) {
      return res.status(400).json({ message: "Invalid degrees data." });
    }

    await Degree.deleteMany({});

    const result = await Degree.insertMany(
      degrees.map((degree) => ({
        ...degree,
        lessons: degree.lessons.map((lesson) => ({
          ...lesson,
          examDate: lesson.examDate ? new Date(lesson.examDate) : null,
        })),
      }))
    );

    if (!result) {
      throw new Error("Failed to insert new degrees");
    }

    res.status(200).json({ message: "Degrees have been updated..!" });
  } catch (error) {
    console.error("Error updating degrees:", error);
    res
      .status(500)
      .json({ message: "Error updating degrees", error: error.message });
  }
};

/** =============================
 * @desc  Delete degrees for a specific grade
 * @route  /api/degrees
 * @method  DELETE
=============================*/
const deleteDegrees = async (req, res) => {
  const { grad } = req.body;

  try {
    if (!grad) {
      return res.status(400).json({ message: "Grade is required" });
    }

    const result = await Degree.deleteMany({ grad });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `No degrees found for grade ${grad}` });
    }

    res
      .status(200)
      .json({ message: `Degrees for grade ${grad} have been deleted..!` });
  } catch (error) {
    console.error("Error deleting degrees:", error);
    res
      .status(500)
      .json({ message: "Error deleting degrees", error: error.message });
  }
};

module.exports = {
  uploadDegrees,
  updateDegrees,
  getDegrees,
  deleteDegrees,
};
