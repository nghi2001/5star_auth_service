"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
class UserRepository {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUser = new UserModel_1.default();
            newUser.username = user.username;
            newUser.password = user.password;
            newUser = yield newUser.save();
            return newUser;
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield UserModel_1.default.findOne(filter);
            return result;
        });
    }
    DeleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield UserModel_1.default.deleteOne(filter);
            return result;
        });
    }
    UpdateOne(filter, prop) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new UserRepository();
