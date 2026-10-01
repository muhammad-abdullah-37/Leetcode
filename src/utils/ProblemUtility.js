const axios = require("axios");

// Geting a language by id
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "javascript": 63,
  };
  return language[lang.toLowerCase()];
};

// Submitting a submission
const submitBatch = async (submissions) => {
//   console.log(`At the start of the Submit batch`);
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "content-type": "application/json",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
    data: {
      submissions,
    },
  };

  // Function for fetching data from the platform
  async function fetchData() {
    try {
    //   console.log(`At the start of the fetch data function`);
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
    console.error('Judge0 status:', error.response?.status);
    console.error('Judge0 body:', JSON.stringify(error.response?.data, null, 2));
    throw error;
}
  }

  return await fetchData();
};

// Creating the waiting fucntion for waiting 1 second  in between the iterations to start the next iteration
const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));
// Creating the token submit function for submitting the token to get the result based on token
const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
    console.error('Judge0 status:', error.response?.status);
    console.error('Judge0 body:', JSON.stringify(error.response?.data, null, 2));
    throw error;
}
  }

  // Checking the result untill it returns true;
  while (true) {
    const result = await fetchData();

    // checking the result based on ID that either programs runs or not , in the queue or not , ok or not
    const isResultObtained = result.submissions.every(
      (result) => result.status_id > 2,
    );
    if (isResultObtained) {
      return result.submissions;
    }
    // Calling the waiting function to wait before the next iteration;
    await waiting(1000);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
