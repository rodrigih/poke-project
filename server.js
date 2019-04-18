const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// Create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: "Your Express backend is connected to React"});
});
