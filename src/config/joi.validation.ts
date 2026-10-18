import Joi from 'joi';


export const JoiValidationShchema = Joi.object({
    MONGODB: Joi.string().required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(5)
})