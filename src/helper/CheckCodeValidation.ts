import { Joi } from "express-validation";

const validation = {
    body: Joi.object({
        _id: Joi.string(),
        code: Joi.string()
    })
}
export default validation