import express from 'express';
import {getBorrows,getBorrow,addBorrow,updateBorrow,deleteBorrow,} from '../controllers/borrow.controller.js';

const router = express.Router();

router.get('/', getBorrows);
router.get('/:id', getBorrow);
router.post('/', addBorrow);
router.put('/:id', updateBorrow);
router.delete('/:id', deleteBorrow);

export default router;
