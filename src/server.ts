import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './route/userRoute'
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

// app.use('/api', userRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});