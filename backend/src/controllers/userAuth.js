const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


const User=require('../models/User');
const Submission=require('../models/submission');
const Problem=require('../models/problem');
const validator=require('../utils/validator');
const becrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const redisClient = require('../config/redis');


const register =async(req,res)=>{
    try {
        //validate the data 
        validator(req.body);

        // Your registration logic here
        const {firstName,emailId,password}=req.body;   

        //hash the password 
        req.body.password=await becrypt.hash(password,10);
        const user=await User.create(req.body)
        req.body.role="user"; //always register as user

        console.log('Creating JWT token...');
        console.log('Token payload:', {_id:user._id, emailId:emailId});
        console.log('JWT_SECRET_KEY for JWT:', process.env.JWT_SECRET_KEY);
        console.log('Type of JWT_SECRET_KEY:', typeof process.env.JWT_SECRET_KEY);
        
        if(!process.env.JWT_SECRET_KEY){
            throw new Error('JWT_SECRET_KEY is undefined at token creation');
        }
        
        //create and send token 
        const token=jwt.sign({_id:user._id, emailId:emailId,role: 'user'},process.env.JWT_SECRET_KEY,{expiresIn:60*60})
        res.cookie("token",token,{maxage:60*60*1000}) //mili 
        //sec second m hota hai 

        res.status(201).json({ message: "User registered successfully" });


    } catch (err) {
        res.status(400).json({ message: "Error "+err });
    }
}

const login=async(req,res)=>{
    console.log('LOGIN FUNCTION CALLED!');
    try {
        console.log('=== LOGIN DEBUG START ===');
        console.log('SECRET_KEY in controller:', process.env.JWT_SECRET_KEY);
        console.log('Request body:', req.body);
        const {emailId,password}=req.body;
        console.log('Extracted emailId:', emailId);
        console.log('Extracted password:', password);

        if(!emailId || !password){
           throw new Error("emailId and password are required");
        }

        //search for user in database
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("user not found");
        }
        const match= await becrypt.compare(req.body.password,user.password);// old +current password
        if(!match){
            throw new Error("invalid password");
        }
         //create and send token 

        const token=jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:60*60})
        res.cookie("token",token,{maxage:60*60*1000}) //mili 
        //sec second m hota hai 
        
        res.status(200).json({ 
            message: "User logged in successfully",
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        res.status(400).json({ message: "Error "+err });
    }
}

const logout=async(req,res)=>{
    try {
        //validate the token
        //token add kr dunga redis m blockList ke naam se
        //cookien ko clear kr dunga
        const {token} = req.cookies;
        const payload = jwt.decode(token);
        await redisClient.set(`token:${token}`, 'blocked');
        await redisClient.expire(`token:${token}`, payload.exp); // Set expiration time for the blocked token (e.g., 
        res.cookie("token",null,{expire :new Date(Date.now())})
        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        res.status(503).json({ message: "Error "+error });     
    }
}

const getProfile=async(req,res)=>{
    try {
        // req.result is set by userMiddleware (the authenticated user)
        const user = req.result;
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            message: "User profile fetched successfully",
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                age: user.age,
                role: user.role,
                photo: user.photo,
                problemSolved: user.problemSolved || [],
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Error "+error });     
    }
}

const getUserStats=async(req,res)=>{
    try {
        const userId = req.result._id;

        // Get total submissions count
        const totalSubmissions = await Submission.countDocuments({ userId });

        // Get accepted submissions count
        const acceptedSubmissions = await Submission.countDocuments({ userId, status: 'accepted' });

        // Get unique problems solved (accepted)
        const solvedSubmissions = await Submission.distinct('problemId', { userId, status: 'accepted' });
        const problemsSolved = solvedSubmissions.length;

        // Get difficulty breakdown by looking up the solved problems
        let easyProblems = 0, mediumProblems = 0, hardProblems = 0;
        if(problemsSolved > 0) {
            const solvedProblems = await Problem.find({ _id: { $in: solvedSubmissions } }, 'difficulty');
            solvedProblems.forEach(p => {
                const diff = p.difficulty?.toLowerCase();
                if(diff === 'easy') easyProblems++;
                else if(diff === 'medium') mediumProblems++;
                else if(diff === 'hard') hardProblems++;
            });
        }

        // Calculate acceptance rate
        const acceptanceRate = totalSubmissions > 0 
            ? Math.round((acceptedSubmissions / totalSubmissions) * 1000) / 10 
            : 0;

        // Get recent submissions for activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSubmissions = await Submission.aggregate([
            { $match: { userId: userId, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
                accepted: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] } }
            }},
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            message: "User stats fetched successfully",
            data: {
                problemsSolved,
                easyProblems,
                mediumProblems,
                hardProblems,
                totalSubmissions,
                acceptedSubmissions,
                acceptanceRate,
                recentActivity: recentSubmissions
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Error " + error });
    }
}

const getUserSubmissions=async(req,res)=>{
    try {
        const userId = req.result._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Submission.countDocuments({ userId });

        const submissions = await Submission.find({ userId })
            .populate('problemId', 'title difficulty')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedSubmissions = submissions.map(s => ({
            _id: s._id,
            problem: s.problemId?.title || 'Unknown Problem',
            problemId: s.problemId?._id,
            difficulty: s.problemId?.difficulty || 'unknown',
            status: s.status,
            language: s.language,
            runtime: s.runtime,
            memory: s.memory,
            testCasesPassed: s.testCasesPassed,
            testCasesTotal: s.testCasesTotal,
            createdAt: s.createdAt
        }));

        res.status(200).json({
            message: "Submissions fetched successfully",
            data: formattedSubmissions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Error " + error });
    }
}

const adminRegister = async (req, res) => {
    try {
        console.log('Admin Register Function Called!');
        //validate the data 
        validator(req.body);
        // if(req.result.role!='admin'){
        //     throw new Error("Only admin can register another admin");
        // }
        // Your registration logic here
        const {firstName,emailId,password}=req.body;   

        //hash the password 
        req.body.password=await becrypt.hash(password,10);
        const user=await User.create(req.body)
        req.body.role="admin"; //always register as admin

        console.log('Creating JWT token...');
        console.log('Token payload:', {_id:user._id, emailId:emailId});
        console.log('JWT_SECRET_KEY for JWT:', process.env.JWT_SECRET_KEY);
        console.log('Type of JWT_SECRET_KEY:', typeof process.env.JWT_SECRET_KEY);
        
        if(!process.env.JWT_SECRET_KEY){
            throw new Error('JWT_SECRET_KEY is undefined at token creation');
        }
        
        //create and send token 
        const token=jwt.sign({_id:user._id, emailId:emailId,role: 'admin'},process.env.JWT_SECRET_KEY,{expiresIn:60*60})
        res.cookie("token",token,{maxage:60*60*1000}) //mili 
        //sec second m hota hai 

        res.status(201).json({ message: "User registered successfully" });
    }catch (error) {
        res.status(400).json({ message: "Error "+error });     
    }
}

module.exports={adminRegister,register,login,logout,getProfile,getUserStats,getUserSubmissions};