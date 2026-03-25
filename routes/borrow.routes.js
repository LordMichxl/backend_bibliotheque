import express from 'express';
import {getBorrows,addBorrow,returnBorrow,} from '../controllers/borrow.controller.js';
import { validateData, validateQuery } from '../middlewares/validation.js';
import { listBorrowsSchema, addBorrowSchema } from '../validations/borrowValidation.js';

const router = express.Router();

router.get('/', validateQuery(listBorrowsSchema), getBorrows);
//router.get('/:id', getBorrow);
router.post('/', validateData(addBorrowSchema), addBorrow);
router.put('/return/:id', returnBorrow);

export default router;