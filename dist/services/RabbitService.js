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
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitService {
    constructor() {
        this.RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
        this.RABBIT_PORT = process.env.RABBIT_PORT || '5672';
        this.RABBIT_USERNAME = process.env.RABBIT_USERNAME || 'guest';
        this.RABBIT_PASS = process.env.RABBIT_PASSWORD || 'guest';
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let connect = yield amqplib_1.default.connect(`${process.env.RABBIT_URL}`);
            return connect;
        });
    }
    sendMessage(content, queue = 'send_mail') {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield this.connect();
            let chanel = yield conn.createChannel();
            chanel.assertQueue(queue);
            chanel.sendToQueue(queue, Buffer.from(content));
        });
    }
}
exports.default = RabbitService;
