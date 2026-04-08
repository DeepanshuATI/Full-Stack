const axios = require("axios");

const getLanguageById = (lang) => {
    const languages = {
        "c++": 54,
        "java": 62,
        "python": 71,
        "javascript": 63,
        "ruby": 72,
    }
    return languages[lang]; // Return null if language not found
}

const submitBatch = async (submissions) => {
    console.log("Submitting batch to Hosted Judge0 API...");

    const options = {
        method: "POST",
        url: "https://ce.judge0.com/submissions/batch", // <-- hosted API
        params: {
            base64_encoded: "false",
        },
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            submissions
        },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // ignore SSL errors on Windows
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
}

const waiting = (timer) => {
    return new Promise((resolve) => setTimeout(resolve, timer));
};

const submitToken = async (resultToken) => {
    const options = {
        method: "GET",
        url: "https://ce.judge0.com/submissions/batch", // <-- hosted API
        params: {
            tokens: Array.isArray(resultToken)
                ? resultToken.join(",")
                : resultToken,
            base64_encoded: "false",
            fields: "*",
        },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // ignore SSL errors
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error.response?.data || error.message);
            throw error;
        }
    }

    while (true) {
        const result = await fetchData();
        // Judge0: 1 = in queue, 2 = processing, 3+ = terminal (Accepted=3, WA=4, ...)
        // Was `> 3` which never becomes true when all tests are Accepted — infinite hang.
        const sid = (s) => (s.status && s.status.id) ?? s.status_id;
        const isResultObtained = result.submissions.every((submission) => sid(submission) > 2);
        if (isResultObtained) {
            return result.submissions;
        }
        await waiting(1000);
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };