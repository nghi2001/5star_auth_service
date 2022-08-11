import {validate, ValidationError, Joi} from 'express-validation'
const LoginValidation = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        devicename: Joi.string()
    })
}
export default LoginValidation