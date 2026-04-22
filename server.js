const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true
}));

app.use(session({
    secret: 'cramlink-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false,// requuired for localhost
    sameSite: 'lax' // fixes Chrome cookie issues

}
}));

// ===== DATABASE CONNECTION =====
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CramLink-imports'
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected");
    }
});

// ===== SERVE FILES =====
app.use(express.static(path.join(__dirname)));

// homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== REGISTER =====
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

// ===== LOGIN =====
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log("LOGIN INPUT:", email, password);

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error during login");
        }

        if (result.length === 0) {
            return res.send("User not found");
        }

        if (result[0].password === password) {
            req.session.user = email;
            res.send("Login successful");
        } else {
            res.send("Incorrect password");
        }
    });
});

// ===== DASHBOARD (PROTECTED) =====
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
        res.send("Please login first");
    }
});

// ===== LOGOUT =====
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send("Logged out");
    });
});

// ===== START SERVER =====
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});