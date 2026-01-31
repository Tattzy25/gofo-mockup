const https = require('https');

const data = JSON.stringify({
  inputs: {
    style: "Invalid Style",
    color: "Colorful",
    aspect_ratio: "1:1",
    get_tatttied: "test prompt",
    quantity: 2
  },
  response_mode: "blocking",
  user: "user-123"
});

const options = {
  hostname: 'api.dify.ai',
  path: '/v1/workflows/run',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer app-4ztXwnODOm1xKavPYMHbG7Nw',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
