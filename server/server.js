/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const db = require('./db');
const pool = require('./pg');

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

// Find a product
app.get('/products', (req, res) => {
  pool
    .query('SELECT * FROM product LIMIT 5')
    .then((data) => {
      res.send(data.rows);
      console.log(data.rows);
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    })
    .catch((e) => console.error(e.stack));
});

// Find related items
app.get('/products/:product_id/related', (req, res) => {
  pool
    .query(
      `SELECT array_agg(related_product_id)
       FROM related
       GROUP BY current_product_id
       HAVING current_product_id = $1;`,
      [req.params.product_id]
    )
    .then((data) => {
      console.log(data.rows[0].array_agg);
      res.send(data.rows[0].array_agg);
    })
    .catch((e) => console.error(e.stack));
});

// Find product info
app.get('/products/:product_id', (req, res) => {
  pool
    .query(
      `SELECT
        product.id, 
        product.name, 
        product.slogan,
        product.description,
        product.category,
        product.default_price,
        (SELECT 
        array_agg((SELECT row_to_json(_) FROM (SELECT f.feature, f.value) AS _)) AS features
      FROM
        feature AS f
      WHERE product_id = $1)
      FROM product
      WHERE id = $1;`,
      [req.params.product_id]
    )
    .then((data) => {
      console.log(data.rows);
      res.send(data.rows);
    })
    .catch((e) => console.error(e.stack));
});

// Find product styles
app.get('/products/:product_id/styles', (req, res) => {
  pool
    .query(
      `SELECT 
        id AS style_id,
          name,
          original_price,
          COALESCE(NULLIF(sale_price, 'null'), '0') AS sale_price,
          (default_style::bool) AS "default?",
        (SELECT 
          array_agg((SELECT row_to_json(_) FROM (SELECT p.thumbnail_url, p.url) AS _)) AS photos
          FROM
            photo AS p
            WHERE p.style_id = style.id),
        (SELECT 
            jsonb_combine((SELECT json_object_agg(s.id, row_to_json(_)) FROM (SELECT s.quantity, s.size) AS _)::jsonb) AS skus
          FROM
            sku AS s
            WHERE s.style_id = style.id)
        FROM style AS style
        WHERE product_id = $1;`,
      [req.params.product_id]
    )
    .then((data) => {
      console.log(data.rows);
      res.send(data.rows);
    })
    .catch((e) => console.error(e.stack));
});

// Find an answer
app.get('/qa/:id/answers', (req, res) => {
  db.findCombinedAnswer({ question_id: req.params.id })
    .then((data) =>
      res.send({
        question: req.params.id,
        page: 0,
        count: 5,
        results: data,
      })
    )
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Find a question
app.get('/qa/:id', (req, res) => {
  db.findQuestion({ product_id: req.params.id })
    .then((data) =>
      res.send({
        product_id: req.params.id,
        results: data,
      })
    )
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
