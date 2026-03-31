const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// allow JSON data from frontend
app.use(express.json());
app.use(cors());

// ===== DATABASE CONNECTION =====
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default is empty
    database: 'cramlink'
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database connection failed");
    } else {
        console.log("✅ Database connected");
    }
});

// ===== SERVE YOUR WEBSITE FILES =====
app.use(express.static(path.join(__dirname)));

// homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== REGISTER USER =====
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("Please fill all fields");
    }

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error saving user");
        }

        res.send("User registered successfully!");
    });
});

// ===== START SERVER =====
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});