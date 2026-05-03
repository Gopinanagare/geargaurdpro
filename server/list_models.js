const https = require('https');
require('dotenv').config();

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
  method: 'GET'
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
req.end();
