// fail 4 , pass 1
const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;

app.use(express.json());

app.post('/webhook', (req, res) => {
  requestCount++;

  const cycle = requestCount % 5;
  if (cycle === 1 || cycle === 2 || cycle === 3 || cycle=== 4 ) {
    console.log(`Attempt ${requestCount}: Returning 400`);
    return res.status(400).json({ error: 'Mock 400 error' });
  } else {
    console.log(`Attempt ${requestCount}: Returning 200`);
    return res.status(200).json({ message: 'Success' });
  }
});

app.listen(port, () => {
  console.log(`Mock webhook service listening on http://localhost:${port}/webhook`);
});
