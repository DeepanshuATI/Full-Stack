const express=require('express');
const Problem = require('../models/problem');
const ProblemRouter=express.Router();
const adminMiddleware=require('../middleware/adminMiddleware');
const{createProblem,updateProblem,deleteProblem,getallProblem,getProblembyid,solvedAllProblemByuser}=require('../controllers/UserProblem')

const userMiddleware=require('../middleware/userMiddleware');

//create admin acess
ProblemRouter.post("/create",adminMiddleware,createProblem);
// //update admin acess only
ProblemRouter.put  ("/update/:id",adminMiddleware,updateProblem);
// //delete admin acess only
ProblemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


// //fetch
 ProblemRouter.get("/",userMiddleware,getallProblem);
 ProblemRouter.get("/:id",userMiddleware,getProblembyid);
 ProblemRouter.get("/user",userMiddleware,solvedAllProblemByuser);

module.exports=ProblemRouter;