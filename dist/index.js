"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_validation_1 = require("express-validation");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
try {
    mongoose_1.default.connect(`${process.env.DB_URL}`)
        .then(() => {
        console.log(process.env.DB_URL);
        console.log("db connected");
    });
}
catch (error) {
    throw error;
}
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "125.235.234.147"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', AuthRoute_1.default);
app.use(function (err, req, res, next) {
    if (err instanceof express_validation_1.ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});
app.get('/test', (req, res) => {
    console.log(req.cookies);
    console.log("nghi");
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
