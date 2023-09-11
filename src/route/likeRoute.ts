import express, { Request, Response } from "express";
const likeRouter = express.Router();
import Auth, { AuthRequest } from "../middleware/auth";
import LikeModel, { createLike, deleteLike, findTotalByPostId } from "../model/like";

likeRouter.post('/like/:postId', Auth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user) {
            const postId: string = req.params.postId;
            const check = await LikeModel.findOne({ user_id: req.user._id, post_id: postId });
            if (check) {
                throw new Error()
            }
            const like = await createLike(req.user._id, postId)
            res.status(201).send(like)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})

likeRouter.delete('/like/:postId', Auth, async (req: AuthRequest, res: Response) => {
    try {

        const postId: string = req.params.postId
        if (req.user) {
            const check = await LikeModel.findOne({ user_id: req.user._id, post_id: postId })
            if (!check) {
                throw new Error()
            }
            await deleteLike(req.user._id, postId)
            res.status(200).send()
        }
    } catch (error) {
        console.log(error);
        res.status(500).send()

    }
})

likeRouter.get('/like/:postId/total', Auth, async (req: AuthRequest, res: Response) => {
    try {
        const postId = req.params.postId
        const likes = await findTotalByPostId(postId)
        res.send(likes)
    } catch (error) {
        console.log(error);
        res.status(500).send()

    }
})


export default likeRouter