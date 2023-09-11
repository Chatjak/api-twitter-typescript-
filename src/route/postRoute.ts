import express, { Request, Response } from "express";
const postRouter = express.Router();
import Auth, { AuthRequest } from "../middleware/auth";
import PostModel, { createPost } from "../model/post";

postRouter.post('/post/create', Auth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user) {
            const post = await createPost(req.user._id, req.body.content);
            return res.send(post)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)

    }
})


postRouter.get('/post/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const post = await PostModel.findById(id)
        if (!post) {
            res.status(404).send()
        }
        res.send(post)
    } catch (error) {
        console.log(error);
        return res.status(500).send()
    }
})

postRouter.delete('/post/:id', Auth, async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id
        if (req.user) {
            const post = await PostModel.findByIdAndDelete({
                _id: id,
                user_id: req.user._id
            })
            if (!post) {
                return res.status(404);
            }
        }
        res.send()
    }
    catch (error) {
        console.log(error);
        res.status(500)
    }
}
)
postRouter.get('/post', async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find({}).populate('user_id').sort({ createdAt: -1 })
        if (!posts) {
            return res.status(404).send()
        }
        res.send(posts)
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})
export default postRouter