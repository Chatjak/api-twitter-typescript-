import mongoose, { InferSchemaType } from "mongoose";
import { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { Interface } from "readline";
dotenv.config()
const JWT_SECRET: any = process.env.JWT_SECRET;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userProfile: {
        type: Buffer
    },
    tokens: [{ token: { type: String, required: true } }]
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.userProfile;
    delete userObject.tokens;
    return userObject;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token
}


userSchema.statics.findByCredentials = async (email: string, password: string) =>{
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;