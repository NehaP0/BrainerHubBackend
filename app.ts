import express from 'express'
import mongoose from 'mongoose'
import auth  from "./middlewares/Authenticator"
import authRouter from './routes/authRouter'
import productRouter from './routes/productRouter'
import cors from 'cors'

import connection from './db'


const app = express()
app.use(express.json());
app.use(cors())


//Routes
app.use('/auth', authRouter)

//middleware for token verification in case of accessing products route
app.use(auth);

app.use('/products', productRouter)



//Starting the server
const port = process.env.PORT
app.listen(port, async()=>{
    try {
        await connection;
        console.log("DB Connected");
      } catch (error) {
        console.log("error connecting to db");
      }
    console.log(`Server running at port ${port}`);
    
})