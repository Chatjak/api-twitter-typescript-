import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'
dotenv.config();
const app = express();
const port = process.env.PORT;
const DATABASE: any = process.env.DATABASE;

const server = async () => {
    await mongoose.connect(DATABASE).then(() => console.log('Connected to server')
    )
}
server();


app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});