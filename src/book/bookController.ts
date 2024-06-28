import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { title, genre, description } = req.body;
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads/",
    fileName
  );
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      bookFileName
    );
    //    const bookFileMimeType = files.file[0].mimetype;

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf", //bookFileMimeType
      }
    );

    console.log(files);
    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      description,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);
    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading the files."));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;
  const book = await bookModel.findOne({ _id: bookId });
  // console.log("bookId", book)
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update others book."));
  }
  let completeCoverImage = "";
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    completeCoverImage = filename;
    const coverImageMimeType = files.file[0].mimetype.split("/").at(-1);
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    const uploadFileResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    completeCoverImage = uploadFileResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  let completeBookFile = "";
  if (files.file) {
    const bookName = files.file[0].filename;
    completeBookFile = bookName;
    const bookPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookName
    );
    const uploadBookResult = await cloudinary.uploader.upload(bookPath, {
      filename_override: bookName,
      folder: "book-pdfs",
      format: "pdf",
    });
    completeBookFile = uploadBookResult.secure_url;
    await fs.promises.unlink(bookPath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      description: description,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      bookFile: completeBookFile ? completeBookFile : book.file,
    },
    {
      new: true,
    }
  );

  res.json({ updatedBook });
};
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find();
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting book"));
  }
};
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.find({ _id: bookId });
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
  } catch (error) {
    return next(createHttpError(500, "Error while deleting book"));
  }
};
export { createBook, updateBook, listBooks, getSingleBook };
