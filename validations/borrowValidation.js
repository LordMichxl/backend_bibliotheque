import Joi from "joi";

export const listBorrowsSchema = Joi.object({
    status: Joi.string().valid('borrowed', 'returned', 'overdue').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

export const addBorrowSchema = Joi.object({
    member_id: Joi.number().integer().positive().required(),
    book_id: Joi.number().integer().positive().required(),
    due_date: Joi.date().iso().required()
});