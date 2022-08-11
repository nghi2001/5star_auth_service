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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RabbitService_1 = __importDefault(require("./RabbitService"));
const UserRepository_1 = __importDefault(require("../repository/UserRepository"));
class UserService {
    constructor() {
        this.RabbitService = new RabbitService_1.default();
        this.UserRepository = new UserRepository_1.default();
    }
    hello() {
        return 'ajnvjlanvl';
    }
    checkUserName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.UserRepository.findOne({ username: name });
            return user;
        });
    }
    activeUser(_id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            // let user = await this.UserRepository.UpdateOne({username:name}, {has_access : true})
            let user = yield this.UserRepository.findOne({ _id: _id });
            if (user) {
                if (user.code == code) {
                    let user = yield this.UserRepository.UpdateOne({ _id: _id }, { has_access: true, code: '' });
                    return true;
                }
                else {
                    return 'InvalidCode';
                }
            }
            else {
                return 'NotFound';
            }
        });
    }
    registerAccount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let salt = yield bcrypt_1.default.genSalt();
            let hashpass = yield bcrypt_1.default.hash(user.password, salt);
            user.password = hashpass;
            let newUser = yield this.UserRepository.create(user);
            this.RabbitService.sendMessage(JSON.stringify({
                mail: newUser.email,
                content: `Đây là code để kích hoạt tài khoản của bạn: ${newUser.code}`
            }));
            let users = yield this.checkUserName(newUser.username);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                console.log('check');
                let User = yield this.checkUserName(newUser.username);
                if ((User === null || User === void 0 ? void 0 : User.has_access) == false) {
                    this.UserRepository.DeleteOne({ _id: newUser._id });
                }
                else {
                }
            }), 60000 * 2);
            return users;
        });
    }
    sigin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.UserRepository.findOne({ username: user.username });
            if (result != null) {
                if (bcrypt_1.default.compareSync(user.password, result.password)) {
                    return { status: true, data: result };
                }
            }
            return { status: false };
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _id, username } = user;
            //create Access Token
            const accessToken = jsonwebtoken_1.default.sign({ _id, username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '5m'
            });
            console.log(process.env.ACCESS_TOKEN_SECRET);
            console.log(1, accessToken);
            //create Refresh Token
            const refreshToken = jsonwebtoken_1.default.sign({ _id, username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: 60 * 60 * 24 * 30
            });
            return {
                accessToken,
                refreshToken
            };
        });
    }
    generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _id, username } = user;
            //create Access Token
            const accessToken = jsonwebtoken_1.default.sign({ _id, username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '5m'
            });
            console.log(process.env.ACCESS_TOKEN_SECRET);
            console.log(1, accessToken);
            return accessToken;
        });
    }
    UpdateRefreshToken(id, name, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.UserRepository.addToken(id, name, token);
            return result;
        });
    }
    changepass(username, newpass) {
        return __awaiter(this, void 0, void 0, function* () {
            let salt = yield bcrypt_1.default.genSalt();
            let hashpass = yield bcrypt_1.default.hash(newpass, salt);
            let newuser = yield this.UserRepository.UpdateOne({ username: username }, { password: hashpass });
        });
    }
    getListToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.UserRepository.findOne({ _id: id });
            if (user && user.refreshToken) {
                return user.refreshToken;
            }
            else {
                return [];
            }
        });
    }
    checkExitsToken(id, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.UserRepository.findOne({ _id: id });
            if (user && user.refreshToken) {
                for (let i = 0; i < ((_a = user.refreshToken) === null || _a === void 0 ? void 0 : _a.length); i++) {
                    console.log(user.refreshToken[i], 'nguyen duy', token);
                    if (user.refreshToken[i].token == token) {
                        return { data: user, status: true };
                    }
                }
                return { status: 'Not Found' };
            }
            else {
                return { status: 'Not Found' };
            }
        });
    }
    revokeToken(idUser, idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.UserRepository.deleteToken(idUser, idToken);
            return result;
        });
    }
}
exports.default = UserService;
