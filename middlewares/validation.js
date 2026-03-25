export const validateData = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        req.body = value;
        next();
    };
    
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        req.query = value;
        next();
    };
};