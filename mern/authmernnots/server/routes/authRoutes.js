import express from 'express'
import { register, LoginUser, getProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router();


router.post('/register', register);
router.post('/login', LoginUser);
router.post('/profile', protect, getProfile);


export default router;

