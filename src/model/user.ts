import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET: any = process.env.JWT_SECRET;
interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    userProfile?: Buffer;
    tokens: string[];
    toJSON(): any;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    userProfile: {
        type: Buffer
    },
    tokens: [{
        token: String,
        require: true
    }]
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const user = this as IUser;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.userProfile;
    return userObject;
}

userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const hashPassword = await bcrypt.hash(user.password, 8);
        user.password = hashPassword;
    }
    next();
})

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}


const User = mongoose.model<IUser>('User', userSchema);

module.exports = User;