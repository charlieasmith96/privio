import Joi from '@hapi/joi';

export const userSchema = Joi.object({

    firstName: Joi.string()
    .regex(/^[a-zA-Z-]+$/, )
    .min(1)
    .max(40)
    .required(),

    lastName: Joi.string()
    .regex(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(1)
    .max(40)
    .required(),

    emailAddress: Joi.string()
    .email()
    .min(4)
    .max(60)
    .required(),

    password: Joi.string()
    .regex(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(8)
    .max(18)
    .required(),

    phoneNumber: Joi.string()
    .alphanum()
    .required()
})