const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;


app.use(express.static('CEN 4350C course project - html'));

// Including credential constants from a js file ignored by git
const { username, password } = require('./credentials');

const connection = mysql.createConnection({
    host: 'localhost',
    user: username,
    password: password,
    database: 'cen4350C_project_db'
});

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to cen4350C_project_db:`, err);
        return;
    }
    console.log('Connected to cen4350C_project_db');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/get-data', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database error');
            return;
        }
        console.log('Query Results:', results);
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


