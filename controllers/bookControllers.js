const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadBook,
  cloudinaryRemoveBook,
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const Book = require("../models/Book");

/** =============================
 * @desc  Add new book
 * @route  /api/books
 * @method  POST
=============================*/

const addNewBook = async (req, res) => {
  const bookPath = req.files.book[0].filename
    ? path.join(__dirname, `../uploads/${req.files.book[0].filename}`)
    : null;
  console.log(req.files.book[0].filename);
  const imagePath = req.files.image
    ? path.join(__dirname, `../uploads/${req.files.image[0].filename}`)
    : null;
  try {
    const { title, grad } = req.body;
    if (!bookPath) {
      return res.status(400).json({ message: "Book file is required." });
    }
    if (!imagePath) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Upload book to cloudinary
    const bookResult = await cloudinaryUploadBook(bookPath);
    console.log(`Book: ${bookResult}`);

    // Upload image to cloudinary
    const imageResult = await cloudinaryUploadImage(imagePath);
    console.log(`Image: ${imageResult}`);

    // Create new audio entry in the database
    const newBook = await Book.create({
      title: title,
      grad: grad,
      image: imageResult.secure_url,
      book: bookResult.secure_url,
    });
    res.json(newBook);
  } catch (error) {
    console.error("Error adding new book:", error);
    res.status(500).json({ message: "Error adding new book" });
  } finally {
    // Delete audio file from server
    if (bookPath && fs.existsSync(bookPath)) {
      fs.unlinkSync(bookPath);
    }
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

/** =============================
 * @desc  Get all books
 * @route  /api/books
 * @method  GET
  =============================*/
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/** =============================
 * @desc  Get single book
 * @route  /api/books/:id
 * @method  GET
  =============================*/
const getSingleBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found..!" });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

/** =============================
 * @desc  Edit book
 * @route  /api/books/:id
 * @method  PATACH
  =============================*/
const editBook = async (req, res, next) => {};

/** =============================
 * @desc  Delete book
 * @route  /api/books/:id
 * @method  DELETE
  =============================*/
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found..!" });
    }
    await cloudinaryRemoveBook(deletedBook.book);
    await cloudinaryRemoveImage(deletedBook.image);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book" });
  }
};

module.exports = {
  addNewBook,
  getAllBooks,
  getSingleBook,
  editBook,
  deleteBook,
};
