import {validate, ValidationError, Joi} from 'express-validation'
const UserValidation = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required()
    })
}
export default UserValidation