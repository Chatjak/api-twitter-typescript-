import express, { Request, Response } from "express";
const userRouter = express.Router();
import UserModel from "../model/user";
import Auth from "../middleware/auth";

userRouter.post('/user/sign-up', async (req: Request, res: Response) => {
    return res.redirect('http://example.com')


})

export default userRouter;