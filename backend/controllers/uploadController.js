import cloudinary from '../utils/cloudinary.js';
import User from '../models/users.js';

export const updloadFile = (req, res, next) => {
    if(!req.file) {
        return res.status(400).json({
            message: 'No file uploaded'
        })
    }
    const stream = cloudinary.uploader.upload_stream(
        {folder: 'Expense-tracker', resource_type: 'auto'},
        async (error, result) => {
            if(error){
                next(error)
            }
            const user = await User.findByIdAndUpdate(req.user?._id, {profile: result.secure_url}, {new: true}).select('-password');
            return res.status(201).json({
                success: true,
                user
            })
        }
    )
    stream.end(req.file.buffer);
}