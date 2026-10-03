const {submitBatch,submitToken,getLanguageById} = require('../utils/ProblemUtility');
const Problem = require('../models/problem');

// Function or Controller for creating a problem
const createProblem = async(req,res) => {
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


// Function or Controller for updating the problem
const updateProblem = async(req,res) => {
    const {id} = req.params;
    const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
    try {
        //Chckeing if Id is valid or not
        if (!(id)) {
            return res.status(400).send('Invalid Id Field');
        }
        // Checking if Id is existed in DB or not
        const DSAProblem = await Problem.findById(id);
        if (!(DSAProblem)) {
            return res.status(404).send('ID is not present in sever')
        }
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

        // Storing the updated data or problem in DB
        const newProblem = await Problem.findByIdAndUpdate(id,{...req.body}, {runValidators : true,new:true});
        res.status(200).send(newProblem);
    } catch (error) {
        res.status(500).send(`Error in Problem Updating : ${error.message}`)
    }
}


// Function or Controller for deleting the problem 
const deleteProblem = async(req,res) => {
    const {id} = req.params;
    try {
        // Checking if Id is missing or invalid
        if (!(id)) {
            return res.status(400).send('Invalid Id');
        }

        // Deleting the Problem or Question
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if (!(deleteProblem)) {
            return res.status(404).send('Problem is Missing')
        }
        res.status(200).send('Problem Deleted Successfully')
    } catch (error) {
        res.status(500).send(`Error in Deleting Problem : ${error.message}`)
    }
}

// Function or Controller for Getting or Fetching a problem based on Id
const getProblemById = async(req,res) => {
    const {id} = req.params;
    try {
        // Checking if id is missing or not
        if (!(id)) {
            return res.status(400).send('Id is Missing');
        }

        // Getting the problem from DB
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution'); // Select is used for selecting between multiple properties of the problem like not selecting any paid feature. 
        if (!(getProblem)) {
            return res.status(404).send('Problem Not Found');
        }
        res.status(200).send(getProblem);
    } catch (error) {
        res.status(500).send(`Error in Fetchinng Problem based on ID : ${error.message}`)
    }
}


// Function or Controller for Fetching all problems
const getAllProblems = async(req,res) => {
    try {
        // Finding all problems with a limit of 10 problems to a single page
        const getProblems = await Problem.find({}).select('_id title difficulty tags');
        if (getProblems.length === 0) {
            return res.status(404).send('Problems Not Found');
        }
        // Sending all problems in response
        res.status(200).send(getProblems);
    } catch (error) {
        res.status(500).send(`Error in Fetching All Problems : ${error.message}`)
    }
}

// Function or Controller for getting all problems which are solved by a user
const solvedAllProblem = async(req,res) => {

} 
module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedAllProblem};