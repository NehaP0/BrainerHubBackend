import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'

const router = express.Router()


//new user registeration
router.post('/register', async(req, res)=>{
    const{username, password} = req.body
    try{
        //if user already exists
        const userExists = await User.findOne({username})
        if(userExists){
            return res.send({"status": 0, "data": null, "message": 'Username already exists'})             
        }
        else{
            //hash the password and then store user credentials in database
            const hashedPassword = await bcrypt.hash(password, 5)
            const newUser = await User.create({username, password:hashedPassword})
            return res.send({"status": 1, "data": null, "message": 'User registered'})
        }
    }
    catch(err){
        return res.send({"status": 0, "data": null, "message": 'Registration failed'})
    }
})

//existing user login functionality
router.post('/login', async(req, res)=>{
    const{username, password} = req.body
    try{
        //check if user's username matches with the one that is there in the database
        const user = await User.findOne({username})

        //if user does not exist in database send response invalid credentials
        if(!user){
            return res.send({"status": 0, "data": null, "message": 'Invalid Credentials'})
        }
        else{
            //if user's username matches with the one that is there in the database, compare the passwords
            const matchPassword = await bcrypt.compare(password, user.password)
            //if passwords did not match send response invalid credentials
            if(!matchPassword){
                return res.send({"status": 0, "data": null, "message": 'Invalid Credentials'})
            }
            else{
                //if password matches too, generate a token which expires in 1 hour
                const token = jwt.sign({userId: user.id}, 'brainerhub', {expiresIn : '1h'})
                return res.send({"status": 1, "data":{token}, "message": 'Your token'})
            }
        }
    }
    catch(err){
             return res.send({"status": 0, "data":null,  "message": 'Login failed'})   
    }
})

export default router