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
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController {
    constructor() {
        this.UserService = new UserService_1.default();
    }
    activeAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, code } = req.body;
                let result = yield this.UserService.activeUser(_id, code);
                let status, msg;
                if (result) {
                    status = 200;
                    msg = 'Ok';
                }
                if (result == 'NotFound') {
                    status = 404;
                    msg = 'Not Found';
                }
                else if (result == 'InvalidCode') {
                    status = 500;
                    msg = 'Sai Code';
                }
                return res.json({
                    status: status,
                    msg: msg
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    msg: error
                });
            }
        });
    }
    getNewToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { refresh_token, user_id } = req.body;
                let checkExitsToken = yield this.UserService.checkExitsToken(user_id, refresh_token);
                if (checkExitsToken && checkExitsToken.status == true) {
                    console.log(checkExitsToken);
                    let token = yield this.UserService.generateAccessToken(checkExitsToken.data);
                    return res.json(token);
                }
                else
                    throw Error('Error');
            }
            catch (error) {
                console.log(error);
                res.status(401).json(error);
            }
        });
    }
    sigup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                let findUser = yield this.UserService.checkUserName(req.body.username);
                if (!findUser) {
                    let user = yield this.UserService.registerAccount(req.body);
                    if (user) {
                        result = {
                            id: user._id,
                            username: user.name
                        };
                    }
                }
                else {
                    result = 'username đã tồn tại';
                }
                return res.json({
                    status: '200',
                    msg: result
                });
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
        });
    }
    sigin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let status, msg;
                const { username, password, deviceName } = req.body;
                let result = yield this.UserService.sigin(req.body);
                if (result.status == false) {
                    status = 401;
                    msg = 'unauthorized';
                }
                else {
                    let token = yield this.UserService.generateToken(result.data);
                    yield this.UserService.UpdateRefreshToken(result.data._id, deviceName, token.refreshToken);
                    status = 200;
                    msg = 'Ok';
                    res.clearCookie('token');
                    res.clearCookie("refresh_token");
                    res.cookie('token', token.accessToken.toString(), { maxAge: 1000 * 60 * 60 * 24 * 30 * 30, httpOnly: true });
                    res.cookie('refresh_token', token.refreshToken.toString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
                }
                return res.json({
                    status,
                    msg
                });
            }
            catch (error) {
                console.log(error);
                res.send(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, newpass } = req.body;
                // let user = await this.UserService.checkUserName(username);
                let status, msg;
                let check = yield this.UserService.sigin({ username, password });
                if (check.status && password != newpass) {
                    let user = yield this.UserService.changepass(username, newpass);
                    status = 200;
                    msg = 'Ok';
                }
                else {
                    status = 401;
                    msg = 'Error';
                }
                res.json({ status, msg });
            }
            catch (error) {
                console.log(error);
                res.send(error);
            }
        });
    }
    getListToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            try {
                if (!req.params.id) {
                    throw Error('thieu id');
                }
                let listToken = yield this.UserService.getListToken(req.params.id);
                console.log(listToken);
                res.json(listToken);
            }
            catch (error) {
                res.json(error);
            }
        });
    }
    revokeToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken, idUser } = req.body;
                const result = yield this.UserService.revokeToken(idUser, idToken);
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.json(error);
            }
        });
    }
}
exports.default = new UserController();
