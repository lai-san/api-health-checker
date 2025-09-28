const https = require("https");

export default function handler(req, res) {
  const userUrl = req.query.url;
  if (!userUrl) return res.status(400).json({ error: "Missing URL" });

  let options;
  try {
    const parsedUrl = new URL(userUrl);
    options = {
      method: "GET",
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {}
    };
    if (parsedUrl.hostname.includes("openai.com")) {
      options.headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
      options.headers["Content-Type"] = "application/json";
    }
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", chunk => data += chunk);
    response.on("end", () => {
      res.status(200).json({
        statusCode: response.statusCode,
        message: response.statusCode >= 200 && response.statusCode < 300 ? "✅ API is healthy" : "⚠️ API might be down",
        snippet: data.slice(0, 200)
      });
    });
  });

  request.on("error", err => res.status(500).json({ error: err.message }));
  request.end();
}
