import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface DecodedToken {
    user: any;
  }


const auth = (req: Request, res: Response, next: NextFunction)=>{
    const token = req.headers.authorization
  
    //if user does not provide token, send response Missing token. Access denied.
    if (!token) {
        return res.send({"status":0, "data":null, "message": "Missing token. Access denied." });
      }

      //if user provides token, verify it. If its correct, move to the next set of code below the middleware
    try{
        const decoded = jwt.verify(token, "brainerhub")  as DecodedToken
        req.body.user = decoded.user;
        next();
    } 
    //If token provided is incorrect, send response Invalid token. Access denied.
    catch (err) {
        return res.send({"status":0, "data":null, message: "Invalid token. Access denied." });
    }
}

export default auth

