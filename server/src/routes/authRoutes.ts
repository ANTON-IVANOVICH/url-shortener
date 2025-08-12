import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout } from '../controllers/authController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateBody } from '../middlewares/validateBody';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post('/register', validateBody(registerSchema), asyncHandler(register));
router.post('/login', limiter, validateBody(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', requireAuth, asyncHandler(logout));

export default router;
