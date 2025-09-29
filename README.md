
# API Health Checker

A simple Node.js project to check the health of Open AI API endpoint. Deployed on Vercel using serverless functions. 
It accepts a target API URL via a GET request and returns the JSON response status code and body. 
Environment variables are used to securely manage sensitive API keys (e.g., OpenAI API key).

## Features
- Serverless deployment on [Vercel](https://vercel.com)
- Secure environment variables (no hardcoded keys)
- JSON response with health status and response body snippet
- Supports GET  OpenAI endpoints

## Live Demo
[API Health Checker](https://api-health-checker-iota.vercel.app/api/health?url=https://api.openai.com/v1/models)

## Tech Stack
Node.js (ES Modules)
Vercel Serverless Functions
Fetch API

## Example 
curl "https://api-health-checker-iota.vercel.app/api/health?url=https://api.openai.com/v1/models"
