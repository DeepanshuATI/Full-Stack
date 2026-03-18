const express = require('express');
const app = express();
require('dotenv').config();

// Debug: Check if environment variables are loaded

const db= require('./config/db')
const cookieParser=require('cookie-parser')

app.use(express.json()); //json to java script object conversion 
app.use(cookieParser()); //string k form m cokkie aayegi usko parse krk object ki form m kr dega readibility bdhane k liye 

const authRouter=require('./routes/userAuth');

app.use('/user',authRouter);


console.log("expess using port number"+process.env.PORT); // Should print 3000

// async function main(){
//     await db();
// }

const redisClient = require('./config/redis');

const IntializeConnection=async()=>{
    try{
        await Promise.all([db(),redisClient.connect()]);
        console.log("Connected to MongoDB and Redis successfully");
        app.listen(process.env.PORT, () => {
            console.log("Server listening at " + process.env.PORT);
        });
    }catch(err){
        console.log("Error connecting to MongoDB or Redis: "+err);
    }
}
IntializeConnection();

// main().then(async()=>{
//     app.listen(process.env.PORT, () => {
//     console.log("Server listening at " + process.env.PORT);
//     });
// })
// .catch(err=>{
//     console.log("error occured"+err);
// })

