import express from "express";
import User from "../models/users.js";
import { protect } from "../middlewares/Auth.js";
const router = express.Router();

router.get('/', (req, res) => {
    const users = User.find({});
    res.json(users);
})

router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { name, email, profile } = req.body;
    try{
        const user = await User.findByIdAndUpdate(id, { name, email, profile }, { new: true }).select('-password');
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.json(user); 
    }catch(error){
        console.error("Updating error", error);
        res.status(500).json({ message: 'Server error' });
    }
})
export default router;