export const validateData = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // retourne toutes les erreurs d'un coup
            stripUnknown: true, // ignore les champs non définis dans le schéma
        });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        req.body = value; // ✅ req.body est réassignable, pas de problème
        next();
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        Object.assign(req.query, value);

        next();
    };
};