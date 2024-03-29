import Express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './routes/AuthRoute';
import mongoose from "mongoose";
import {Request,Response,NextFunction} from 'express';
import { ValidationError } from "express-validation";
const app = Express();

dotenv.config();

const PORT = process.env.PORT || 4000;

try {
    mongoose.connect(`${process.env.DB_URL}`)
        .then(() => {
            console.log(process.env.DB_URL);
            
            console.log("db connected");
            
        })
} catch(error) {
    throw error
}

app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000","125.235.234.147"],
    credentials: true
}));
app.use(Express.json())
app.use(Express.urlencoded({extended:true}))

app.use('/user',AuthRoute)

app.use(function(err:any, req:Request, res:Response, next:NextFunction) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
  })

app.get('/test', (req, res) => {
    console.log(req.cookies);
    console.log("nghi");
    
    
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    
})