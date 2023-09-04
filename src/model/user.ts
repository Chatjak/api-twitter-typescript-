import mongoose, { Document, InferSchemaType } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET: any = process.env.JWT_SECRET;



export const userSchema = new mongoose.Schema({
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


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    // if (userObject.userProfile === undefined && userObject.userProfile === null) {
    //     delete userObject.userProfile;
    // }
    delete userObject.userProfile;
    return userObject;
}
export type User = Document & InferSchemaType<typeof userSchema>;
export type IUser = InferSchemaType<typeof userSchema>;
const UserModel = mongoose.model('User', userSchema);


export const getUser = async () => UserModel.find();
export const getUserByEmail = async (email: string) => UserModel.findOne({ email });
export const createUser = async (values: Record<string, any>) => {
    const user = new UserModel(values);
    await user.save();
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return { user, token };
}
export const loginUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return { user, token }
}

export const deleteUser = async (_id: string) => {
    try {
        await UserModel.findByIdAndDelete(_id)
    } catch (error) {
        console.log(error);
    }
}
export const updateUserById = async (id: string, password: string) => {
    const user = await UserModel.findById(id)
    if (user) {
        user.password = password;
        await user.save()
    }
    return user
};
export default UserModel;
