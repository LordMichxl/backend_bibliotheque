import express from 'express';
import { getBooks ,addBook, updateBook, deleteBook } from '../controllers/book.controller.js';
import { upload } from '../middlewares/upload.js';
import { validateData } from '../middlewares/validation.js';
import { bookSchema } from '../validations/bookValidation.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get("/",auth, getBooks);
router.post("/",auth,validateData(bookSchema),upload.single('cover_image'), addBook);
router.put("/:id",auth,validateData(bookSchema),upload.single('cover_image'),updateBook);
router.delete("/:id",auth, deleteBook);

export default router;