import {validate, ValidationError, Joi} from 'express-validation'
const validation = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        newpass: Joi.string().required(),
    })
}
export default validation