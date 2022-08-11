"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const validation = {
    body: express_validation_1.Joi.object({
        _id: express_validation_1.Joi.string(),
        code: express_validation_1.Joi.string()
    })
};
exports.default = validation;
