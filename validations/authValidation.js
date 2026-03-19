import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                        'string.base': 'le nom doit être une chaîne de caractères',
                        'string.min': 'le nom doit comporter au moins 2 caractères',
                        'string.max': 'le nom doit comporter au maximum 100 caractères',
                        'any.required': 'le nom est requis'
                }),
    email: Joi.string()
            .email()
            .required(),
    password: Joi.string()
            .min(6)
            .required(),
});