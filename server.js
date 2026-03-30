const express = require('express');

const app = express();
const port = 3000;

// simple test route
app.get('/', (req, res) => {
    res.send("Server is alive!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});