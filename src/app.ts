import express, {  } from "express";
import gobalErrorHander from "./middlewares/gobalErrorHandler";
import userRouter from './user/userRouter';
import bookRouter from "./book/bookRouter";
import cors from 'cors'
const app = express();
app.use(express.json())

app.use(cors({
origin:"http://localhost:3000/"
}))
app.use('/api/users', userRouter)
app.use("/api/books", bookRouter);
app.use(gobalErrorHander);
export default app;
