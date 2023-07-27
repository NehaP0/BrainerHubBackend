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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
//new user registeration
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //if user already exists
        const userExists = yield user_1.default.findOne({ username });
        if (userExists) {
            return res.send({ "status": 0, "data": null, "message": 'Username already exists' });
        }
        else {
            //hash the password and then store user credentials in database
            const hashedPassword = yield bcrypt_1.default.hash(password, 5);
            const newUser = yield user_1.default.create({ username, password: hashedPassword });
            return res.send({ "status": 1, "data": null, "message": 'User registered' });
        }
    }
    catch (err) {
        return res.send({ "status": 0, "data": null, "message": 'Registration failed' });
    }
}));
//existing user login functionality
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //check if user's username matches with the one that is there in the database
        const user = yield user_1.default.findOne({ username });
        //if user does not exist in database send response invalid credentials
        if (!user) {
            return res.send({ "status": 0, "data": null, "message": 'Invalid Credentials' });
        }
        else {
            //if user's username matches with the one that is there in the database, compare the passwords
            const matchPassword = yield bcrypt_1.default.compare(password, user.password);
            //if passwords did not match send response invalid credentials
            if (!matchPassword) {
                return res.send({ "status": 0, "data": null, "message": 'Invalid Credentials' });
            }
            else {
                //if password matches too, generate a token which expires in 1 hour
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'brainerhub', { expiresIn: '1h' });
                return res.send({ "status": 1, "data": { token }, "message": 'Your token' });
            }
        }
    }
    catch (err) {
        return res.send({ "status": 0, "data": null, "message": 'Login failed' });
    }
}));
exports.default = router;
