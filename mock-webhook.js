// fail 4 , pass 1
const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;

app.use(express.json());

app.post('/webhook', (req, res) => {
  requestCount++;

 // Log full request body
  console.log(`\n=== Attempt ${requestCount} ===`);
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  const cycle = requestCount % 5;
  if (cycle === 1 || cycle === 2 || cycle === 3 || cycle === 4) {
    console.log("Returning HTTP 400");
    return res.status(400).json({ error: 'Mock 400 error' });
  } else {
    console.log("Returning HTTP 200 and reset requestCount to 0");
    requestCount = 0;
    return res.status(200).json({ message: 'Success' });
  }
});

app.listen(port, () => {
  console.log(`Mock webhook service listening on http://localhost:${port}/webhook`);
});
