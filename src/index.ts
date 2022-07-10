import Express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './routes/AuthRoute';
import mongoose from "mongoose";
const app = Express();

dotenv.config();
try {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        .then(() => {
            console.log("db connected");
            
        })
} catch(error) {
    throw error
}

app.use(cors());
app.use(Express.json())
app.use(Express.urlencoded({extended:true}))

app.use('/auth',AuthRoute)

app.get('/test', (req, res) => {

    for(let i =0 ; i< 10000000; i++) {
        console.log(i);
        
    }
})

app.listen(4000)