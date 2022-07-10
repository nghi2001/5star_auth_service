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
const validateEmail_1 = __importDefault(require("../helper/validateEmail"));
class UserController {
    constructor() {
    }
    sigup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.username == '' ||
                req.body.username == null ||
                req.body.password == null ||
                req.body.password == '') {
                res.status(400);
                res.json("missign params");
            }
            let user = yield UserService_1.default.checkUserName(req.body.username);
            if (user != null) {
                res.status(400).json("user already exists");
            }
            else {
                if ((0, validateEmail_1.default)(String(req.body.username))) {
                    let newUser = yield UserService_1.default.registerAccount(req.body);
                    console.log(newUser);
                    res.status(200).json(newUser);
                }
                else {
                    res.status(400);
                    res.json("email not valid");
                }
            }
        });
    }
    sigin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.username == '' ||
                req.body.username == null ||
                req.body.password == null ||
                req.body.password == '') {
                res.status(400);
                res.json("missign params");
            }
            let result = yield UserService_1.default.sigin(req.body);
            if (result.status == false) {
                res.status(401).json("unauthorized");
            }
            else {
                let token = yield UserService_1.default.generateToken(result.data);
                res.cookie('rememberme', '1', { maxAge: 900000 });
                res.send('kdkd');
            }
        });
    }
}
exports.default = new UserController();
