"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (email) => {
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};
