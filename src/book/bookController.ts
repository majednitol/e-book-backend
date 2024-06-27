import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, genre, description } = req.body;
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname,"../../public/data/uploads/",fileName)
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)
   try {
  const uploadResult = await  cloudinary.uploader.upload(filePath,{
        filename_override: fileName,
        folder: "book-covers",
        format :coverImageMimeType
  })
       
       const bookFileName = files.file[0].filename;
       const bookFilePath = path.resolve(__dirname,"../../public/data/uploads/",bookFileName);
    //    const bookFileMimeType = files.file[0].mimetype;

       const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
           filename_override: bookFileName,
           folder: "book-pdfs",
           format :"pdf"      //bookFileMimeType
       })

       bookModel.create({
           title,
           description,
           genre, 
          author: "666f0de310daee5113d38976",
           coverImage: uploadResult.secure_url,
           file: bookFileUploadResult.secure_url,
       })
       await fs.promises.unlink(filePath)
       await fs.promises.unlink(bookFilePath)
   } catch (error) {
       console.log(error)
       return next(createHttpError(500,"Error while uploading the files."))
   }
    res.json({})
}

export {createBook}