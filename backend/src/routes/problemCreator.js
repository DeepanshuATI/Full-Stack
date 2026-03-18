const express=require('express');
const Problem = require('../models/problem');
const prolemRouter=express.Router();
const adminMiddleware=require('../middleware/adminMiddleware');



//create admin acess
ProblemRouter.post("/create",adminMiddleware,createProblem);
//update admin acess only
ProblemRouter.patch  ("/update/:id",adminMiddleware,updateProblem);
//delete admin acess only
ProblemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


//fetch
ProblemRouter.get("/",getallProblem);
ProblemRouter.get("/:id",getProblembyid);
ProblemRouter.get("/user",solvedAllProblemByuser);

