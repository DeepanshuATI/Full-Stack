const express=require('express');
const authRouter=express.Router();
const {adminRegister,register,login,logout,getProfile}=require('../controllers/userAuth');
const userMiddleware=require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');

authRouter.post('/register',register );
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.get('/getProfile',getProfile);
authRouter.post('/admin/register',adminMiddleware,adminRegister ); ///lock admin from there mongodb mtlb wahi pr likh do admin register krne ke liye

module.exports=authRouter;
