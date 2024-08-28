import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import bcrypt from "bcrypt";
import { User } from "./userTypes";

import { config } from "../config/config";
import { sign } from "jsonwebtoken";
import userModel from "./userModel";



const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Feild Required ");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User Already exsit!");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user."));
  }
  try {
    const token = sign({ sub: newUser._id ,role:"admin"}, config.jwt_secret as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while sign jwt token."));
  }
};
const loginUser = async ( req: Request,res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, "All feild required");
    return next(error);
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "user not found"));
    }

    const ismatch = await bcrypt.compare(password, user.password as string);
  
    if (!ismatch) {
      return next(createHttpError(400, "Username or password incorrect!"));
    }
    
    const token = sign({ sub: user._id }, config.jwt_secret as string, {
      expiresIn: "7d",
    });

    res.json({
      accessToken: token,
    });
  } catch (error) {
       return next(createHttpError(500,"login error"))
  }
};
export { createAccount,loginUser };
