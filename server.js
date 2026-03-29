const express = require('express');
const app = express();
const port = 3000;

// Serve your existing files (HTML, JS, CSS)
app.use(express.static(__dirname));

// Optional: A test “brain” API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node brain!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});