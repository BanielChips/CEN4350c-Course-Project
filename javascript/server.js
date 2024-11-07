const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Including credentials from a js file ignored by git
const { username, password } = require('./credentials');

const connection = mysql.createConnection({
    host: 'localhost',
    user: username,
    password: password,
    database: 'cen4350C_project_db'
});

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to database`, err);
        return;
    }
    console.log('Connected to cen4350C_project_db');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/');
});

app.get('/get-data', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'INSERT INTO newsletter (email) VALUES (?)';
  connection.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Email succesfully subscribed!' });
  });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return  res.status(400).json({ error: '(first, last, email, password) are required' });
  }

  connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error('Error finding email', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPass) => {
      if(err) {
        consle.error('Error jumbling password');
        return res.status(500).send('Potato error');
      }

      const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?)';
      connection.query(query, [name, email, hashedPass], (err, results) => {
        if(err) {
          console.error('Error submitting to database');
          return res.status(500).send('Database error');
        }

        res.status(200).json({ message: 'User Registered'});
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return req.status(400).json({error: 'Username and password required'});
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('A user with the given email has not been found');
      return res.status(500).send('Verification error');
    }

    if (results.length === 0) {
      return  res.status(400).json({error: 'User email not found'});
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, passMatch) => {
      if (err) {
        console.error('Error with encryption compare', err);
        return res.status(500).send('Server error');
      }

      if (!passMatch) {
        return res.status(400).send('Password not valid');
      }

      res.status(200).json({message: 'Login successful'});
    })

  });

})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


