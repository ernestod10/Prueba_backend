import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../user/UserModel';

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth;
    User.findByToken(token).then((user: IUser | null) => {
        if (!user) {
            return Promise.reject();
        }
        req.cookies.auth = token;
        req.cookies.user = user;
        next();
    }).catch(() => {
        
        res.status(401).send("Unauthorized");
    });
}

export default auth;
