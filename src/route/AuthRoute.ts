import express from 'express'
import UserModel, { User, createUser, getUser, getUserByEmail, loginUser } from '../model/user';
import Auth, { AuthRequest } from '../middleware/auth';
const AuthRoute = express.Router();

AuthRoute.post('/auth/sign-up', async (req: express.Request, res: express.Response) => {
    const { email } = req.body
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

AuthRoute.post('/auth/sign-out', Auth, async (req: AuthRequest, res: express.Response) => {
    try {
        if (req.user) {
            req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
            await req.user.save()
            return res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
})
AuthRoute.post('/auth/sign-out-all', Auth, async (req: AuthRequest, res: express.Response) => {
    try {
        if (req.user) {
            req.user.tokens = []
            await req.user.save();
            return res.sendStatus(200)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);

    }
})

export default AuthRoute;
