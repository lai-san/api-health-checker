require("dotenv").config();
const express = require("express");
const https = require("https");
const urlModule = require("url");
const app = express();
const port = 3000;

// Serve static files from "public" folder
app.use(express.static("public"));

// Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dynamic health-check endpoint
app.get("/health", (req, res) => {
  const userUrl = req.query.url;
  if (!userUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  let options = {};
  try {
    const parsedUrl = new urlModule.URL(userUrl);

    options = {
      method: "GET",
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {}
    };

    // Add OpenAI key if endpoint is OpenAI
    if (parsedUrl.hostname.includes("openai.com")) {
      options.headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
      options.headers["Content-Type"] = "application/json";
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => data += chunk);
    response.on("end", () => {
      res.json({
        statusCode: response.statusCode,
        message: response.statusCode >= 200 && response.statusCode < 300 ? "API is healthy" : "API might be down",
        snippet: data.slice(0, 200)
      });
    });
  });

  request.on("error", (err) => res.status(500).json({ error: err.message }));
  request.end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
