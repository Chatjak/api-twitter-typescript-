import mongoose, { Document, InferSchemaType } from "mongoose";
import { Schema } from "mongoose";

const likeSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true })

export type Like = Document & InferSchemaType<typeof likeSchema>;

const LikeModel = mongoose.model('Like', likeSchema)

export default LikeModel

export const findByPostId = async (postId: string) => {
    const likes = await LikeModel.find({ post_id: postId }).sort({ createdAt: -1 })
    return likes
}

export const findTotalByPostId = async (postId: string) => {
    const likes = await findByPostId(postId);
    if (!likes) {
        return 0
    }
    const total = likes.length;
    return total.toString()
}

export const createLike = async (user_id: string, post_id: string) => {
    const like = new LikeModel({
        user_id: user_id,
        post_id: post_id
    })
    try {
        await like.save()
        return like;
    } catch (error) {
        throw new Error()
    }
}

export const deleteLike = async (user_id: string, post_id: string) => {
    const like = await LikeModel.findOneAndDelete({
        user_id: user_id,
        post_id: post_id
    })
    if (!like) {
        throw new Error()
    }
    return;
}


