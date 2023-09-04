import express, { Request, Response } from "express";
const userRouter = express.Router();
import UserModel, { deleteUser, updateUserById } from "../model/user";
import Auth, { AuthRequest } from "../middleware/auth";
import multer from 'multer'
import sharp from "sharp";


userRouter.get('/user/me', Auth, async (req: AuthRequest, res: Response) => {

    const data = [req.user, req.user?.userProfile]
    res.send(data)
})
userRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id
    const user = await UserModel.findById(id);
    if (!user) {
        return res.sendStatus(404);
    }
    const data = [user, user?.userProfile]
    res.send(data)
})

//delete user
userRouter.delete('/user/me', Auth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user) {
            await deleteUser(req.user._id);
            return res.sendStatus(202);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
})

//upload userProfile
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)/)) {
            return cb(new Error('please upload a jpg jpeg or png'))
        }
        cb(null, true)
    }
})
userRouter.post('/user/me/userProfile', Auth, upload.single('userProfile'), async (req: AuthRequest, res: express.Response) => {
    try {
        const buffer = await sharp(req.file?.buffer).resize({ width: 150, height: 150 }).png().toBuffer();
        if (req.user) {
            req.user.userProfile = buffer;
            await req.user.save();
            return res.sendStatus(201);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)

    }
})

userRouter.get('/user/me/userProfile', Auth, async (req: AuthRequest, res: express.Response) => {
    try {
        const user = req.user;
        if (!user?.userProfile) {
            return res.sendStatus(404)
        }
        res.set('Content-Type', "image/png");
        res.send(user.userProfile)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)

    }
})

userRouter.patch('/user/me/password', Auth, async (req: AuthRequest, res: express.Response) => {
    try {
        if (req.user) {
            const user = await updateUserById(req.user._id, req.body.password);
            return res.send(user)
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});



export default userRouter;