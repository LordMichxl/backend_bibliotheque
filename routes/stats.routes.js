import express from 'express';
import { getBookStats, getMemberStats, getBorrowStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/books', getBookStats);
router.get('/members', getMemberStats);
router.get('/borrows', getBorrowStats);

export default router;