"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const token = req.headers.authorization;
    //if user does not provide token, send response Missing token. Access denied.
    if (!token) {
        return res.send({ "status": 0, "data": null, "message": "Missing token. Access denied." });
    }
    //if user provides token, verify it. If its correct, move to the next set of code below the middleware
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "brainerhub");
        req.body.user = decoded.user;
        next();
    }
    //If token provided is incorrect, send response Invalid token. Access denied.
    catch (err) {
        return res.send({ "status": 0, "data": null, message: "Invalid token. Access denied." });
    }
};
exports.default = auth;
