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
const uuid_1 = require("uuid");
class UserRepository {
    constructor() {
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUser = new UserModel_1.default();
            newUser.username = user.username;
            newUser.password = user.password;
            newUser.email = user.email;
            newUser.name = user.name;
            newUser.code = (0, uuid_1.v4)();
            let result = yield newUser.save();
            return result;
        });
    }
    updateToken(id, name, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let User = yield UserModel_1.default.findById(id);
                if (User) {
                    for (let i = 0; i < User.refreshToken.length; i++) {
                        if (User.refreshToken[i].name == name) {
                            User.refreshToken[i].token = token;
                        }
                    }
                }
            }
            catch (error) {
                return error;
            }
        });
    }
    deleteToken(idUser, idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(idUser, idToken);
                let User = yield UserModel_1.default.findOne({ _id: idUser });
                User === null || User === void 0 ? void 0 : User.refreshToken.id(idToken).remove();
                User = yield User.save();
                console.log(User);
                return User;
            }
            catch (error) {
                return error;
            }
        });
    }
    addToken(id, name, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let User = yield UserModel_1.default.findById(id);
                if (User) {
                    for (let i = 0; i < User.refreshToken.length; i++) {
                        if (User.refreshToken[i].name == name) {
                            User.refreshToken[i].token = token;
                            console.log(1);
                            yield User.save();
                            return;
                        }
                    }
                    User === null || User === void 0 ? void 0 : User.refreshToken.push({ name: name, token: token });
                    console.log(2);
                    yield (User === null || User === void 0 ? void 0 : User.save());
                }
                return true;
            }
            catch (error) {
                return error;
            }
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
    UpdateOne(filter, update) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield UserModel_1.default.findOneAndUpdate(filter, update);
        });
    }
}
exports.default = UserRepository;
