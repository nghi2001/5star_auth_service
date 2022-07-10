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
const UserRepository_1 = __importDefault(require("../repository/UserRepository"));
class UserService {
    hello() {
        return 'ajnvjlanvl';
    }
    checkUserName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserRepository_1.default.findOne({ username: name });
            return user;
        });
    }
    activeUser(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserRepository_1.default.UpdateOne({ username: name }, { has_access: true });
        });
    }
    registerAccount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let salt = yield bcrypt_1.default.genSalt();
            let hashpass = yield bcrypt_1.default.hash(user.password, salt);
            user.password = hashpass;
            let newUser = yield UserRepository_1.default.create(user);
            // setTimeout(async () => {
            //     let User = await this.checkUserName(newUser.username);
            //     if(User?.has_access == false) {
            //         UserRepository.DeleteOne({_id: newUser._id});
            //     } else {
            //     }
            // },10000)
            return newUser;
        });
    }
    sigin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield UserRepository_1.default.findOne({ username: user.username });
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
                expiresIn: '10m'
            });
            console.log(process.env.ACCESS_TOKEN_SECRET);
            console.log(1, accessToken);
            //create Refresh Token
            const refreshToken = jsonwebtoken_1.default.sign({ _id, username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            return {
                accessToken,
                refreshToken
            };
        });
    }
}
exports.default = new UserService();
