//same as userMiddleware but with extra check for admin role and also check in redis blockList
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const redisClient = require("../config/redis")

const adminMiddleware = async (req,res,next)=>{

    try{
        console.log("adminMiddleware Called");
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log('Payload in adminMiddleware:', payload);
        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if(payload.role!='admin')
            throw new Error("Invalid Token");

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;

        console.log("adminMiddleware Passed, user is admin:", result);
        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }

}


module.exports = adminMiddleware;
