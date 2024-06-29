import express, {  } from "express";
import gobalErrorHander from "./middlewares/gobalErrorHandler";
import userRouter from './user/userRouter';
import bookRouter from "./book/bookRouter";
const app = express();
app.use(express.json())


app.use('/api/users', userRouter)
app.use("/api/books", bookRouter);
app.use(gobalErrorHander);
export default app;
