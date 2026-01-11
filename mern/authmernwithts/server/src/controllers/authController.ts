import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthRequest, RegisterUserBody, LoginUserBody, AuthResponse } from '../types/index.js';
import User from '../models/User.js';
export const registerUser = async (
    req: Request<{}, {}, RegisterUserBody>,
    res: Response
): Promise<Response | void> => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};
export const loginUser = async (
    req: Request<{}, {}, LoginUserBody>,
    res: Response<AuthResponse | { message: string }>
): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && password && (await bcrypt.compare(password, user.password as string))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
            res.json({
                token,
                user: {
                    id: user._id as unknown as string,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        res.json(user);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};