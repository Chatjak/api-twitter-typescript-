import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { NextFunction } from 'express';
import UserModel, { User } from '../model/user'; // Import IUser from your user model
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;

interface DecodedToken extends JwtPayload {
    _id: string; // Assuming _id is present in your JWT payload
}

interface AuthRequest extends express.Request {
    token?: string;
    user?: User;
}

const Auth = async (req: AuthRequest, res: express.Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Please authenticate' });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken; // Use 'as DecodedToken' for type assertion
        const user = await UserModel.findOne({
            _id: decoded._id,
            "tokens.token": token
        });
        if (!user) {
            return res.status(401).json({ error: 'Please authenticate' });
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
}

export default Auth;
