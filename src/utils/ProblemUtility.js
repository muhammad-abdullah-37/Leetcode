const axios = require('axios');

// Geting a language by id
const getLanguageById = (language) => {
    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }
    return language[language.toLowerCase()]
}

// Submitting a submission
const submitBatch = async(submissions) => {
    
    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
    base64_encoded: 'true',
},
headers: {
    'content-type': 'application/json',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'x-rapidapi-key': process.env.RAPID_API_KEY
},
data: {
    submissions
}
};

// Function for fetching data from the platform
async function fetchData() {
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

return await fetchData();

}


module.exports = {getLanguageById,submitBatch}











