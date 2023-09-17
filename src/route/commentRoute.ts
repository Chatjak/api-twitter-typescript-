import express, { Request, Response } from 'express'
import CommentModel, { createComment, findByPostId } from '../model/comment'
const commentRouter = express.Router()
import Auth, { AuthRequest } from '../middleware/auth'



commentRouter.post('/comment', Auth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user) {
            const { post_id, content } = req.body
            const comment = await createComment(req.user._id, post_id, content)
            res.status(201).send(comment)

        }
    } catch (error) {
        console.log(error);
        res.status(500).send()

    }
})

commentRouter.get('/comment/:postId', async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const comments = await findByPostId(postId);
        res.send(comments)
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})








export default commentRouter