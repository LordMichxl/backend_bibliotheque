import express from 'express';
import { register, login, getProfile } from '../controllers/user.controller.js';
import { validateData } from '../middlewares/validation.js';
import { registerSchema } from '../validations/authValidation.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.post('/register', validateData(registerSchema), register);
router.post('/login', login);
router.get('/profile',auth,getProfile)

export default router;
