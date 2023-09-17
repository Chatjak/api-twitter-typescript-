import mongoose, { Document, InferSchemaType } from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

export type Comment = Document & InferSchemaType<typeof commentSchema>

const CommentModel = mongoose.model('Comment', commentSchema)

export const findByPostId = async (postId: string) => {
    const comment = await CommentModel.find({ post_id: postId }).populate('user_id').sort({ createdAt: -1 })
    return comment
}

export const createComment = async (user_id: string, post_id: string, content: string) => {
    const comment = new CommentModel({ user_id: user_id, post_id: post_id, content: content })
    await comment.save()
    return comment
}

export default CommentModel