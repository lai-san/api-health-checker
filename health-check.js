// health-check.js 
require("dotenv").config();
const https = require("https"); 

const url = "https://api.openai.com/v1/models"; 
const apikey = process.env.OPENAI_API_KEY;

const options = { 
method: "GET", 
headers: {
"Authorization": `Bearer ${apikey}`, 
"Content-Type": "application/json"
} 
}; 

const req = https.request(url, options, (res) => { 
console.log(`Status Code: ${res.statusCode}`);
 
if (res.statusCode >= 200 && res.statusCode < 300) { 
console.log("OpenAI models API is healthy"); 
} else { 
console.log("API might be down"); 
} 
}); 

req.on("error", (error) => { 
console.error("Error connecting to API:", error.message); 
}); 

req.end();
