import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}


export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: req.body.token,
        })
    } else {
        res.status(404).json({ message: 'User not found' })
    }

}