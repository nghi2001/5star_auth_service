"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const validation = {
    body: express_validation_1.Joi.object({
        username: express_validation_1.Joi.string().required(),
        password: express_validation_1.Joi.string().required(),
        newpass: express_validation_1.Joi.string().required(),
    })
};
exports.default = validation;
