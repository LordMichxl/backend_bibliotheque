import express from 'express';
import { getBookStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/books', getBookStats);

export default router;