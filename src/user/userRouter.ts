import express, { Request, Response } from 'express'
import { createAccount, loginUser } from './userController'

const userRouter = express.Router()
userRouter.post('/register', createAccount)
userRouter.get("/", (req:Request, res:Response) => {
    res.send("Hello World")
 
});
userRouter.post("/login", loginUser);
export default userRouter