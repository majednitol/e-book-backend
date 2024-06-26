import express from 'express'
import { createAccount, loginUser } from './userController'

const userRouter = express.Router()
userRouter.post('/register', createAccount)
userRouter.post("/login", loginUser);
export default userRouter