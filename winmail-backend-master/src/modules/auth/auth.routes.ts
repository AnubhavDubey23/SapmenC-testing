import express from 'express';
import AuthController from './auth.controllers';
import { apiLimiter } from '../../utils/rateLimiter';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-email', apiLimiter, AuthController.verifyEmail);
router.post('/verify-otp', apiLimiter, AuthController.verifyOTP);

export default router;
