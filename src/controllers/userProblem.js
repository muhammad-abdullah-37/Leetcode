const {submitBatch,submitToken,getLanguageById} = require('../utils/ProblemUtility');
const Problem = require('../models/problem');


const createProblem = async(req,res) => {
    console.log(`At the start of the problem creation`);
     // Extracting the problem data from the request
        const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
    try {
        // Iterating over the referenceSolution for each language along with the code
        for (const {language,completeCode} of referenceSolution) { 
            // Getting a language for making it unique;
            const languageId = getLanguageById(language);
            //visible Test cases iteration for creating an array for the batch submission
            const submissions = visibleTestCases.map((testcase) =>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
            }) )

            // Submitting the batcht to the Judge0
            const submitResult = await submitBatch(submissions);
            console.log(`Submit Result : ${submitResult.data}`);
            // Getting all the token in an array which are used to get the answers from the platform
            const resultToken = submitResult.map((value) => value.token);
            // Getting and storign the result based on tokens
            const testResult = await submitToken(resultToken);
            // console.log(`Test Result : ${testResult}`);
            // Iterating over each result for checking the status id to show the output to the user
            for (const test of testResult) {
                if (test.status_id !==3) {
                    return res.status(400).send(`Error Occured`);
                }
            }
        }

        // Storing the problem in DB after everything is passed and clear 
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator:req.result._id
        });
        res.status(201).send(`Problem Saved Successfully`)
    } catch (error) {
        res.status(400).send(`Error in Problem Creation : ${error.message}`);
    }
}


module.exports = {createProblem};