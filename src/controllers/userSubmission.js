const Problem = require("../models/problem");
const Submission = require('../models/submission')
const {getLanguageById} = require('../utils/ProblemUtility');
const {submitBatch} = require('../utils/ProblemUtility')
const {submitToken} = require('../utils/ProblemUtility')

// Submitting code
const submitCode = async(req,res) => {
    try {
        // Extracting user and problem id for keeping details like who submitted which problem
        const userId = req.result._id;
        const problemId = req.params.id;
        // Extracting the code and language;
        const {code,language} = req.body;
        // validaing the user id , code , problem id and language
        if (!userId || !problemId || !code || !language) {
            res.status(400).send('Fields Missing')
        }
        // Fetching the problem from DB to check the hidden testcases of the problem or code sent by user
        const problem = await Problem.findById(problemId);
        //Storing users code or comming data from the frontend before sending it to the judge0 (because judge0 server can crash ro network failure may cause the code loss)
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        // Sending or submitting code to judge0
        const languageId = getLanguageById(language);
        const submissions = problem.hiddenTestCases.map((testcase) =>({
            source_code:code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output
        }))
        const submitResult = await submitBatch(submissions);
        const resultToken = await submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        // updating the submission result for checking how many testcases are passed 
        let testCasePassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;
        for (const test of testResult) {
            if (test.status_id === 3) {
            testCasePassed++;
            runtime = runtime + parseFloat(test.time);
            memory = Math.max(memory,test.memory);
            } else{
                if (test.status_id === 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                } else{
                    status = 'wrong'
                    errorMessage = test.stderr;
                }
            }
        }

        // Storing result in DB in Submission Collection
        submittedResult.status = status;
        submittedResult.testCasesPassed= testCasePassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        await submittedResult.save()
        // Adding the problemId in problem solved of the user schema for checking the total unique problems solved on the platform. Id will be added if is not present already for making it unique
        if (!req.result.problemsSolved.includes(problemId)) {
            req.result.problemsSolved.push(problemId);
            await req.result.save();
        }
        res.status(201).send(submittedResult)
    } catch (error) {
        res.status(500).send(`Error in Code Submission : ${error.message}`);
    }
}

// Function or Controller for Running the code
const runCode = async(req,res) => {
     try {
        // Extracting user and problem id for keeping details like who submitted which problem
        const userId = req.result._id;
        const problemId = req.params.id;
        // Extracting the code and language;
        const {code,language} = req.body;
        // validaing the user id , code , problem id and language
        if (!userId || !problemId || !code || !language) {
            res.status(400).send('Fields Missing')
        }
        // Fetching the problem from DB to check the hidden testcases of the problem or code sent by user
        const problem = await Problem.findById(problemId);
      
        // Sending or submitting code to judge0
        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcase) =>({
            source_code:code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output
        }))
        const submitResult = await submitBatch(submissions);
        const resultToken = await submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
        res.status(201).send(testResult);
    } catch (error) {
        res.status(500).send(`Error in Code Submission : ${error.message}`);
    }
}
  

module.exports = {submitCode,runCode}