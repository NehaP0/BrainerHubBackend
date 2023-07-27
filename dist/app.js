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
const express_1 = __importDefault(require("express"));
const Authenticator_1 = __importDefault(require("./middlewares/Authenticator"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Routes
app.use('/auth', authRouter_1.default);
//middleware for token verification in case of accessing products route
app.use(Authenticator_1.default);
app.use('/products', productRouter_1.default);
//Starting the server
const port = process.env.PORT;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default;
        console.log("DB Connected");
    }
    catch (error) {
        console.log("error connecting to db");
    }
    console.log(`Server running at port ${port}`);
}));
