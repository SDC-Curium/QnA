/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use(express.json());

// Find an answer
app.get('/qa/:id/answers', (req, res) => {
  db.findAnswer({ question_id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => console.error(err));
});

// Find a question
app.get('/qa/:id', (req, res) => {
  db.findQuestion({ product_id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => console.error(err));
});

// Submit question
app.post('/qa:id', (req, res) => {
  const data = req.body;
  db.createQuestion({
    asker_email: data.email,
    asker_name: data.name,
    body: data.body,
    date_written: Date.now(),
    helpful: 0,
    id: 0,
    product_id: req.params.id,
    reported: 0,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => console.error(err));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
