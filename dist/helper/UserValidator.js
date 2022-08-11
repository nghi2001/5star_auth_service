"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const UserValidation = {
    body: express_validation_1.Joi.object({
        email: express_validation_1.Joi.string()
            .email()
            .required(),
        username: express_validation_1.Joi.string().required(),
        password: express_validation_1.Joi.string().required(),
        name: express_validation_1.Joi.string().required()
    })
};
exports.default = UserValidation;
