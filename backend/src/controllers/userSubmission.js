const Problem = require('../models/problem');
const Submission = require('../models/submission');
//const getLanguageById = require('../utils/getLangId');
const { getLanguageById, submitBatch, submitToken } = require('../utils/getLangId');

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    const actlanguage = getLanguageById(language);

    if (!code || !actlanguage || !problemId || !userId) {
      return res.status(400).json({ message: "Code and language are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.invisibletestCases.length,
      testCasesPassed: 0,
    });

    let submissions = problem.invisibletestCases.map(({ input, output }) => ({
      source_code: code,
      language_id: actlanguage,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);

    const tokens = submitResult.map((t) => t.token);
    const results = await submitToken(tokens);

    let passed = 0;
    let runtime = 0;
    let memory = 0;
    let errorMessage = null;

    for (const r of results) {
      if (r.status.id === 3) {
        passed++;
      } else if (!errorMessage) {
        errorMessage = r.stderr || r.compile_output || r.status.description;
      }

      runtime = Math.max(runtime, Number(r.time || 0));
      memory = Math.max(memory, Number(r.memory || 0));
    }

    submission.status = passed === problem.invisibletestCases.length ? "accepted" : "failed";
    submission.testCasesPassed = passed;
    submission.errorMessage = errorMessage;
    submission.runtime = runtime;
    submission.memory = memory;

    await submission.save();

    return res.status(200).json({
      message: "Code executed successfully",
      passed,
      total: problem.invisibletestCases.length,
      status: submission.status,
      runtime,
      memory,
      errorMessage,
      submissionId: submission._id,
    });

  } catch (error) {
    return res.status(500).json({ message: "Error submitting code " + error.message });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    const actlanguage = getLanguageById(language);

    if (!code || !actlanguage || !problemId || !userId) {
      return res.status(400).json({ message: "Code and language are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }


    let submissions = problem.visibletestCases.map(({ input, output }) => ({
      source_code: code,
      language_id: actlanguage,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);

    const tokens = submitResult.map((t) => t.token);
    const results = await submitToken(tokens);




    return res.status(200).json(results);

  } catch (error) {
    return res.status(500).json({ message: "Error submitting code " + error.message });
  }
};


module.exports ={ submitCode, runCode };