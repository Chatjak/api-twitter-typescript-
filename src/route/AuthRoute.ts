import express from 'express'
import UserModel, { createUser, getUser, getUserByEmail, loginUser } from '../model/user';
const AuthRoute = express.Router();

AuthRoute.post('/auth/sign-up', async (req: express.Request, res: express.Response) => {
    const { email, username, password } = req.body
    const haveUser = await getUserByEmail(email);
    if (haveUser) {
        return res.sendStatus(400);
    }
    try {
        const user = await createUser(req.body);
        return res.status(201).send(user)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);

    }
})

AuthRoute.post('/auth/sign-in', async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body
    try {
        const user = await loginUser(email, password);
        if (!user) {
            return res.sendStatus(400);
        }
        res.cookie('token', user.token);
        res.send(user)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
})

export default AuthRoute;
