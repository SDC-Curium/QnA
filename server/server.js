/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use(express.json());

// Find an answer
// Takes a very long time!
app.get('/qa/:id/answers', (req, res) => {
  Promise.all([
    db.findAnswer({ question_id: req.params.id }),
    db.findAnswerPhoto({ answer_id: req.params.id }),
  ])
    .then(([data, photos]) => {
      res.send({
        // eslint-disable-next-line no-underscore-dangle
        ...data._doc,
        photos,
      });
    })
    .catch((err) => console.error(err));
});

// Find a question
app.get('/qa/:id', (req, res) => {
  db.findQuestion({ product_id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => console.error(err));
});

// Submit a question
app.post('/qa/:id', (req, res) => {
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

// Submit an answer
app.post('/qa/:id/answers', (req, res) => {
  const data = req.body;
  const promises = [];
  if (data.photos.length !== 0) {
    data.photos.forEach((photo) => {
      promises.push(
        db.createAnswerPhoto({
          answer_id: req.params.id,
          url: photo,
        })
      );
    });
  }
  Promise.all(promises)
    .then(() => {
      db.createAnswer({
        asker_email: data.email,
        asker_name: data.name,
        body: data.body,
        date_written: Date.now(),
        helpful: 0,
        id: 0,
        question_id: req.params.id,
        reported: 0,
      })
        .then(() => res.sendStatus(201))
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
