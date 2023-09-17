import mongoose, { Document, InferSchemaType } from "mongoose";
import { Schema } from "mongoose";

const postSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });
export type Post = Document & InferSchemaType<typeof postSchema>;

const PostModel = mongoose.model('Post', postSchema)

export const createPost = async (id: string, content: string) => {
    const post = new PostModel({ content: content, user_id: id });
    await post.save();
    return post
}

export const findByMe = async (user_id: string) => {
    const posts = await PostModel.find({ user_id: user_id }).populate('user_id').sort({ createdAt: -1 })
    return posts
}



export default PostModel