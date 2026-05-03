const https = require('https');
require('dotenv').config();

const data = JSON.stringify({
  contents: [{ parts: [{ text: "hi" }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
