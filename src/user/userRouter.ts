import express, {  } from 'express'
import { createAccount, loginUser } from './userController'

const userRouter = express.Router()
userRouter.post('/register', createAccount)
// userRouter.get("/", (req:Request, res:Response) => {
//     res.send("Hello World 34aa")
 
// });
userRouter.post("/login", loginUser);
export default userRouter