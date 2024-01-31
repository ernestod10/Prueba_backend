import {Request, Response, NextFunction} from 'express';
import User, {IUser} from '../user/UserModel';

const auth = (req:Request, res:Response,next:NextFunction) => {
    const token = req.cookies.auth;
    User.findByToken(token)
        .then((user: IUser | null) => {
            // Handle user retrieval logic here
            if (!user) {
                // Handle case where user is not found
            } else {
                // User found, continue with authentication logic
                req.user = user;
                next();
            }
        })
        .catch((err: Error) => {
            // Handle error if user retrieval fails
            next(err);
        });
}