import https from 'https';
export default function handler(req, res) {
  const userUrl = req.query.url;
  console.log('You have input url', userUrl);
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
      let snippet = "";
      try {
        snippet = JSON.stringify(JSON.parse(data),null,2);
      } catch {
        console.log('This error');
        snippet = data.slice(0,200);
      }
      res.status(200).json({
        statusCode: response.statusCode,
        message: response.statusCode >= 200 && response.statusCode < 300 ? "API is healthy" : "API might be down",
        snippet: data.slice(0, 5000)
      });
    });
  });

  request.on("error", err => res.status(500).json({ error: err.message }));
  request.end();
}
