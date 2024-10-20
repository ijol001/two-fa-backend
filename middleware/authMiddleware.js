import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import dotenv from "dotenv";
dotenv.config()

var checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1];
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await userModel.findById(userID).select('-password');

            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({ "status": "failed", "message": "Unauthorized User" });
        }
    }

    if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No token" });
    }
};

export default checkUserAuth;
