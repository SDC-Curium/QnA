/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../dist')));
app.use(express.json());

// Initializing.
let questionId;
let answerId;
let photoId;
(async () => {
  try {
    questionId = await db.Question.countDocuments({});
    answerId = await db.CombinedAnswer.countDocuments({});
    photoId = await db.CombinedAnswer.aggregate([
      { $unwind: '$photos' },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(`q: ${questionId}, a: ${answerId}, p:${photoId[0].count}`);
  } catch (err) {
    console.error(err);
  }
  console.log('Finished Initializing');
})();

// Find an answer
app.get('/qa/:id/answers', (req, res) => {
  db.findCombinedAnswer({ question_id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Find a question
app.get('/qa/:id', (req, res) => {
  db.findQuestion({ product_id: req.params.id })
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
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
    id: questionId++,
    product_id: req.params.id,
    reported: 0,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Submit an answer
app.post('/qa/:id/answers', (req, res) => {
  const data = req.body;
  db.createCombinedAnswer({
    asker_email: data.email,
    asker_name: data.name,
    body: data.body,
    date_written: Date.now(),
    helpful: 0,
    id: answerId++,
    question_id: req.params.id,
    reported: 0,
    photos: data.photos,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// markQAsHelpful
app.put('/qa/question/:qid/helpful', (req, res) => {
  db.Question.findOneAndUpdate(
    {
      id: req.params.qid,
    },
    {
      $inc: { helpful: 1 },
    }
  )
    .exec()
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// reportQuestion
app.put('/qa/question/:qid/report', (req, res) => {
  db.Question.findOneAndUpdate(
    {
      id: req.params.qid,
    },
    {
      $inc: { reported: 1 },
    }
  )
    .exec()
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// markAnsAsHelpful
app.put('/qa/answer/:aid/helpful', (req, res) => {
  db.CombinedAnswer.findOneAndUpdate(
    {
      id: req.params.aid,
    },
    {
      $inc: { helpful: 1 },
    }
  )
    .exec()
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// reportAns
app.put('/qa/answer/:aid/report', (req, res) => {
  db.CombinedAnswer.findOneAndUpdate(
    {
      id: req.params.aid,
    },
    {
      $inc: { reported: 1 },
    }
  )
    .exec()
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
