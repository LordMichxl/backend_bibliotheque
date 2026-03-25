import express from 'express';
import { getCategory,addCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { validateData } from '../middlewares/validation.js';
import { categorySchema } from '../validations/categoryValidation.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get("/",auth, getCategory);
router.post("/",validateData(categorySchema),auth, addCategory);
router.put("/:id",validateData(categorySchema),auth, updateCategory);
router.delete("/:id",auth, deleteCategory);

export default router;