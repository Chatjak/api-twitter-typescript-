import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './route/userRoute'
import AuthRoute from './route/AuthRoute';
import postRouter from './route/postRoute';
import likeRouter from './route/likeRoute';
import commentRouter from './route/commentRoute';
dotenv.config();
const app = express();
const port = process.env.PORT;
const DATABASE: any = process.env.DATABASE;

const server = async () => {
    await mongoose.connect(DATABASE).then(() => console.log('Connected to server')
    )
}
server();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', userRouter);
app.use('/api', AuthRoute);
app.use('/api', postRouter)
app.use('/api', likeRouter)
app.use('/api', commentRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});