import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import gobalErrorHander from "./middlewares/gobalErrorHandler";
const app = express();
app.get("/", (req, res, next) => {
    const error = createHttpError();
    throw error
  
});

app.use(gobalErrorHander);
export default app;
