import Joi from "joi";

export const bookSchema =  Joi.object({
    title: Joi.string()
    .min(1)
    .max(255)
    .required(),
    author: Joi.string()
    .min(1)
    .max(255)
    .required(),
    isbn: Joi.string()
    .max(20),
    category_id: Joi.number()
    .integer()
    .positive()
    .required(),
    quantity: Joi.number()
    .integer()
    .min(0)
    .default(1)
    .required(),
    available_quantity: Joi.number()
    .integer()
    .min(0)
    .default(Joi.ref('quantity')),
    description: Joi.string()
    .max(1000)
})