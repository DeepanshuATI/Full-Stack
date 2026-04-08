const axios=require('axios');

const getLanguageById=(lang)=>{
    const languages = {
        "c++": 54,
        "java": 62,
        "python": 71,
        "javascript": 63,
        "ruby": 72,
    }
    return languages[lang]; // Return null if language not found
}

const submitBatch=async(submissions)=>{
    // Implement the logic to submit the batch of code submissions to the Judge0 API
    // You can use axios or any HTTP client to make the API requests 
    console.log("Submitting batch to Judge0 API...");
    const axios = require("axios");

    const options = {
        method: "POST",
        url: "http://localhost:2358/submissions/batch",
        params: {
        base64_encoded: "false",
    },
    headers: {
        "Content-Type": "application/json",
    },
    data: {
        submissions
        },
    };

    async function sendBatch() {
    try {
        const res = await axios.request(options);
        console.log(res.data);
        return res.data;
        
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw new Error("Failed to submit batch to Judge0 API");
    }
}  
  console.log("calling sendBatch...");
   return await sendBatch();
    //why do we axios
    //ftech =>jsobnject but it auto trnaslate to json
    //promise result req not fullfill code error auto
}

const waiting = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, timer);
  });
};

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "http://localhost:2358/submissions/batch",
    params: {
      tokens: Array.isArray(resultToken)
        ? resultToken.join(",")
        : resultToken,
      base64_encoded: "false",
      fields: "*",
    },
  };

  async function fetchData(){
    try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
  }
  
  while (true) {
    const result = await fetchData();
    // Terminal states are status_id >= 3 (Accepted=3). `> 3` never true for Accepted → infinite loop.
    const sid = (s) => (s.status && s.status.id) ?? s.status_id;
    const isResultObtained = result.submissions.every((submission) => sid(submission) > 2);
    if (isResultObtained) {
      return result.submissions;
    }
    await waiting(1000);
  }
};

module.exports={getLanguageById,submitBatch,submitToken};