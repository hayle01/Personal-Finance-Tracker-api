import jwt from "jsonwebtoken";
import User from '../models/users.js'

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);

    if(!token){
        return res.status(401).json({message: "No token"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('user', req.user);
        next()
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"})
        next(error)
    }
}