// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Webhook log container
const logs = {
  'ebr-execute': [],
  'batch-status': [],
  'ebr-execute-config': [],
  'batch-status-config': []
};

// Request count tracker for simulated error response
const requestCounts = {
  'ebr-execute': 0,
  'batch-status': 0,
  'ebr-execute-config': 0,
  'batch-status-config': 0
};

// Register all POST webhooks
Object.keys(logs).forEach((type) => {
  app.post(`/webhook/${type}`, (req, res) => {
    const timestamp = new Date().toISOString();
    requestCounts[type]++;

    let response, statusCode;
    // if (requestCounts[type] % 6 !== 0) {
    //   statusCode = 400; 
    //   response = { error: `${type} failed`, timestamp };
    // } else {
    //   statusCode = 200;
    //   response = { message: `${type} received`, timestamp };
    // }

    statusCode = 200; 
    response = { error: `${type} failed`, timestamp };

    logs[type].push({
      timestamp,
      headers: req.headers,
      body: req.body,
      responseStatus: statusCode,
      responseBody: response,
      responseHeaders: { 'Content-Type': 'application/json' }
    });

    console.log(`📥 [${timestamp}] ${type} webhook received - Status ${statusCode}`);
    console.log(JSON.stringify(req.body, null, 2));

    res.status(statusCode).json(response);
  });

  // View logs for each webhook
  app.get(`/logs/${type}`, (req, res) => {
    res.json(logs[type]);
  });

  // Clear logs
  app.delete(`/logs/${type}`, (req, res) => {
    logs[type].length = 0;
    requestCounts[type] = 0;
    res.json({ message: `Logs for ${type} cleared` });
  });
});

app.listen(port, () => {
  console.log(`🚀 Webhook Monitor running at http://localhost:${port}`);
});
