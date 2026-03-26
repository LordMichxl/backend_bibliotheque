import Joi from "joi";

export const listMembersSchema = Joi.object({
    search: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(200).default(10)
});

export const addMemberSchema = Joi.object({
    first_name: Joi.string().min(1).max(100).required(),
    last_name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().max(500).optional(),
    membership_date: Joi.date().iso().default(() => new Date()),
    status: Joi.string().valid('active', 'inactive').default('active')
});