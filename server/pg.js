const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

// const id = 1;

// pool
//   .query(
//     `SELECT
//     id AS style_id,
//       name,
//       original_price,
//       COALESCE(NULLIF(sale_price, 'null'), '0') AS sale_price,
//       (default_style::bool) AS "default?",
//     (SELECT
//       array_agg((SELECT row_to_json(_) FROM (SELECT p.thumbnail_url, p.url) AS _)) AS photos
//     FROM
//       photo AS p
//       WHERE p.style_id = style.id),
//     (SELECT
//       jsonb_combine((SELECT json_object_agg(s.id, row_to_json(_)) FROM (SELECT s.quantity, s.size) AS _)::jsonb) AS skus
//     FROM
//       sku AS s
//       WHERE s.style_id = style.id)
//   FROM style AS style
//   WHERE product_id = $1;`,
//     [3]
//   )
//   .then((data) => {
//     console.log(data.rows[0]);
//     pool.end();
//   })
//   .catch((e) => console.error(e.stack));

module.exports = pool;
