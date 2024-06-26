import express, {  } from "express";
import gobalErrorHander from "./middlewares/gobalErrorHandler";
import userRouter from './user/userRouter';
const app = express();
app.use(express.json())
// app.get("/", (req:Request, res:Response, next:NextFunction) => {
//     const error = createHttpError();
//     throw error
  
// });


app.use('/api/users',userRouter)
app.use(gobalErrorHander);
export default app;
