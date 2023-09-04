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




export default PostModel