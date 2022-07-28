const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use(express.json());

// app.get('/', (req, res) => {
// res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
app.get('/questions', (req, res) => {
  db.find()
    .then((data) => res.send(data))
    .catch((err) => console.error(err));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
