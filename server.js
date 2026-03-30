const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// serve all your files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});