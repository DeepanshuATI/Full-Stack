const { getLanguageById, submitBatch, submitToken } = require('../utils/getLangId');
const Problem = require('../models/problem');
const Submission = require('../models/submission');

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibletestCases,
    invisibletestCases,
    startcode,
    problemCreator,
    referenceSolution
  } = req.body;

  try {
    let submissions = [];

    // 🔥 build submissions
    for (const { language, initialcode } of referenceSolution) {
      const actlanguage = getLanguageById(language);

      for (const element of visibletestCases) {
        const { input, output } = element;

        submissions.push({
          source_code: initialcode,
          language_id: actlanguage,
          stdin: input,
          expected_output: output,
        });
      }
    }

    console.log(submissions);
  console.log("hello1");

    // 🔥 submit to Judge0
    console.log("hello2");
    const submitResult = await submitBatch(submissions);
    console.log("hello3");
    console.log("submitResult:", submitResult);
    // 🔥 extract tokens
    const resultToken = submitResult.map((value) => value.token);

    // 🔥 get results
    const testResults = await submitToken(resultToken);
    console.log("testResults:", testResults);

    // 🔥 validate results
    for (const test of testResults) {
      if (test.status.id !== 3) {
        return res.status(400).json({
          message: "Reference solution failed on visible test cases"
        });
      }
    }

    // 🔥 create problem in DB
    const newProblem = new Problem({
        ...req.body,
        problemCreator: req.result._id
    });
    await newProblem.save();

    // ✅ success
    return res.status(201).json({
      message: "Problem created successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating problem " + error.message,
    });
  }
};

const updateProblem = async (req, res) => {
  const {id}=  req.params;
  if(!id){
    return res.status(400).json({
      message:"Problem id is required"
    });
  }
  const existingProblem= await Problem.findById(id);
  if(!existingProblem){
    return res.status(404).json({
      message:"Problem not found"
    });
  }

  const {
    title,
    description,
    difficulty,
    tags,
    visibletestCases,
    invisibletestCases,
    startcode,
    problemCreator,
    referenceSolution
  } = req.body;

  try {
    let submissions = [];

    // 🔥 build submissions
    for (const { language, initialcode } of referenceSolution) {
      const actlanguage = getLanguageById(language);

      for (const element of visibletestCases) {
        const { input, output } = element;

        submissions.push({
          source_code: initialcode,
          language_id: actlanguage,
          stdin: input,
          expected_output: output,
        });
      }
    }

    console.log(submissions);
  console.log("hello1");

    // 🔥 submit to Judge0
    console.log("hello2");
    const submitResult = await submitBatch(submissions);
    console.log("hello3");
    console.log("submitResult:", submitResult);
    // 🔥 extract tokens
    const resultToken = submitResult.map((value) => value.token);

    // 🔥 get results
    const testResults = await submitToken(resultToken);
    console.log("testResults:", testResults);

    // 🔥 validate results
    for (const test of testResults) {
      if (test.status.id !== 3) {
        return res.status(400).json({
          message: "Reference solution failed on visible test cases"
        });
      }
    }

    
    const newProblem= await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true,new:true});

    // ✅ success
    return res.status(200).json({
      message: "Problem updated successfully",
      problem: newProblem
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating problem " + error.message,
    });
  }
}

const deleteProblem = async (req, res) => {
  const {id}=  req.params;
  if(!id){
    return res.status(400).json({
      message:"Problem id is required"
    });
  }
  const existingProblem= await Problem.findById(id);
  if(!existingProblem){
    return res.status(404).json({
      message:"Problem not found"
    });
  }

  try {
    const deletedProblem=await Problem.findByIdAndDelete(id);
    if(!deletedProblem){
      return res.status(404).json({
        message:"Problem not found"
      });
    }

    return res.status(200).json({
      message:"Problem deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting problem " + error.message,
    });
  }
}

const getProblembyid=async(req,res)=>{
  try{
    const {id}=  req.params;
    if(!id){
      return res.status(400).json({
        message:"Problem id is required"
      });
    }
    const existingProblem= await Problem.findById(id).select('_id title description difficulty tags visibletestCases  startcode referenceSolution');
    //-hiddentestcases
    if(!existingProblem){
      return res.status(404).json({
        message:"Problem not found"
      });
    }

    return res.status(200).json(existingProblem);

  }catch(error){
    return res.status(500).json({
      message: "Error fetching problem " + error.message,
    });
  }
}

const getallProblem=async(req,res)=>{
  try{
    const allProblem= await Problem.find({}).select('_id title  difficulty tags');
    if(allProblem.length===0){
      return res.status(404).json({
        message:"No problem found"
      });
    }
    return res.status(200).json(allProblem);
  
  }catch(error){
    return res.status(500).json({
      message: "Error fetching problem " + error.message,
    });
  }
}

const solvedAllProblemByuser=async(req,res)=>{
    
}



//$EQ NE GT GTE GT LT LTE IN NIN 
//PROBLEM.FIND({VOTES:{$GT:10},TAGS{$IN:["ARRAY","HASHMAP"]}}) => PROBLEM WITH VOTES GREATER THAN 10
//pagination
//localhost:30000/problem/user/getallproblem?page=1&limit=10
//page=2, limit=10 => skip=>(page-1)*limit 
//AWAIT PROBLEM.FIND({}).SKIP((PAGE-1)*LIMIT).LIMIT(LIMIT)
//FILTER BY DIFFICULTY
//AWAIT PROBLEM.FIND({DIFFICULTY :"EASY"}).SKIP((PAGE-1)*LIMIT).LIMIT(LIMIT)

module.exports ={ createProblem, updateProblem ,deleteProblem,getProblembyid,solvedAllProblemByuser,getallProblem};