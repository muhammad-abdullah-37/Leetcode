const getLanguageById = require('../utils/ProblemUtility');
const submitBatch = require('../utils/ProblemUtility');
const createProblem = async(req,res) => {
     // Extracting the problem data from the request
        const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
    try {
        // Iterating over the referenceSolution for each language along with the code
        for (const {language,completeCode} of referenceSolution) { 
            // Getting a language for making it unique;
            const languageId = getLanguageById(language);
            //visible Test cases iteration for creating an array for the batch submission
            const submissions = visibleTestCases.map((input,output) =>({
                source_code:completeCode,
                language_id:language,
                stdin:input,
                expected_output:output
            }) )

            // Submitting the batcht to the Judge0
            const submitResult = await submitBatch(submissions);
            
        }
    } catch (error) {
        
    }
}

module.exports = createProblem;