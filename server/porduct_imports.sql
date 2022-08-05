CREATE TABLE product (
  id BIGSERIAL NOT NULL,
  name VARCHAR(50) NOT NULL,
  slogan VARCHAR(150) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  default_price INTEGER NOT NULL,
  feature_id BIGINT REFERENCES feature (id),
  UNIQUE(feature_id),
  PRIMARY KEY (id)
);

COPY product(id, name, slogan, description, category, default_price)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/product.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE feature (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  feature VARCHAR(30) NOT NULL,
  value VARCHAR(100) NOT NULL
);

COPY feature(id, product_id, feature, value)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/features.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE style (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(30) NOT NULL,
  sale_price VARCHAR(30),
  original_price INTEGER DEFAULT 0,
  photo_id BIGINT REFERENCES photo (id),
  UNIQUE(photo_id),
  sku_id BIGINT REFERENCES sku (id),
  UNIQUE(sku_id),
  default_style INTEGER NOT NULL
);

COPY style(id, product_id, name, sale_price, original_price, default_style)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/styles.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE sku (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  style_id INTEGER NOT NULL,
  size VARCHAR(4) NOT NULL,
  quantity INTEGER NOT NULL
);

COPY sku(id, style_id, size, quantity)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/skus.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE sku (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  style_id INTEGER NOT NULL,
  size VARCHAR(8) NOT NULL,
  quantity INTEGER NOT NULL
);

COPY sku(id, style_id, size, quantity)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/skus.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE photo (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  style_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(39999) NOT NULL
);

COPY photo(id, style_id, url, thumbnail_url)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/photos.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE related (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  current_product_id INTEGER NOT NULL,
  related_product_id INTEGER NOT NULL
);

COPY related(id, current_product_id, related_product_id)
FROM '/home/kappa/git/QnA/SDC Application Data - Atelier Project (_Clean_ Data Set)/legacy/related.csv'
DELIMITER ','
CSV HEADER;

SELECT m.make, m.model, t.ag
FROM (
  SELECT make, AVG(price) AS ag
  FROM car
  GROUP BY make
  ) t JOIN car m ON m.make = t.make;

SELECT m.make, m.model, t.ag
FROM (
  SELECT make, AVG(price) AS ag
  FROM car
  GROUP BY make
  ) t JOIN car m ON m.make = t.make;

-- Add foreign id.
CREATE TABLE foreign (
  id BIGSERIAL NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  car_id BIGINT REFERENCES car (id),
  UNIQUE(car_id)
);

-- Add an id to a table
UPDATE person SET car_id = 2 WHERE id = 2;
UPDATE product SET feature_id = 1 WHERE id = 1;

-- Inner Join
SELECT * FROM person
JOIN car ON person.car_id = car.id;

-- expand mode
\x

SELECT person.first_name, car.make, car.model, car.price
FROM person
JOIN car ON person.car_id = car.id;
-----------------------------------------------------
-- Working on feature/product
SELECT product.id, product.name, feature.product_id, feature.feature, feature.value
FROM product
JOIN feature ON product.id = feature.product_id
WHERE product_id = 11;

-- aggregate features
SELECT 
  array_agg((SELECT row_to_json(_) FROM (SELECT f.feature, f.value) AS _)) AS features
FROM
  feature AS f
WHERE product_id = 11;

-- Both
SELECT
  product.id, 
  product.name, 
  (SELECT 
    array_agg((SELECT row_to_json(_) FROM (SELECT f.feature, f.value) AS _)) AS features
  FROM
    feature AS f
  WHERE product_id = 11
  )
FROM product
WHERE id = 11;
-----------------------------------------------------
-- Working on style
CREATE INDEX product_id_idx_on_style ON style (product_id);
CREATE INDEX product_id_idx_on_feature ON feature (product_id);
CREATE INDEX product_id_idx_on_feature ON feature (product_id);
CREATE INDEX current_product_id_idx_on_related ON related (current_product_id);


SELECT *,
  array_agg((SELECT thumbnail_url, url FROM photo WHERE style_id = 1))
FROM style WHERE product_id = 1;

-- photos
CREATE INDEX style_id_idx ON photo (style_id);
SELECT thumbnail_url, url FROM photo WHERE style_id = 1;
-- Photos for style
SELECT 
  array_agg((SELECT row_to_json(_) FROM (SELECT p.thumbnail_url, p.url) AS _)) AS pg_sux
FROM
  photo AS p
  WHERE p.style_id = 1;


-- sku
CREATE INDEX style_id_idx_on_sku ON sku (style_id);
SELECT 
  json_agg((SELECT json_object_agg(s.id, row_to_json(_)) FROM (SELECT s.quantity, s.size) AS _)) AS pg_sux
FROM
  sku AS s
  WHERE s.style_id = 1;

SELECT 
  jsonb_combine((SELECT json_object_agg(s.id, row_to_json(_)) FROM (SELECT s.quantity, s.size) AS _)::jsonb)
FROM
  sku AS s
  WHERE s.style_id = 1;

-- New aggregate function to combine jsons
-- https://stackoverflow.com/questions/57249804/combine-multiple-json-rows-into-one-json-object-in-postgresql
CREATE AGGREGATE jsonb_combine(jsonb) 
(
    SFUNC = jsonb_concat(jsonb, jsonb),
    STYPE = jsonb
);
-- Combined things
SELECT 
  id AS style_id,
    name,
    original_price,
    COALESCE(NULLIF(sale_price, 'null'), '0') AS sale_price,
    (default_style::bool) AS "default?",
  (SELECT 
    array_agg((SELECT row_to_json(_) FROM (SELECT p.thumbnail_url, p.url) AS _)) AS photos
  FROM
    photo AS p
    WHERE p.style_id = 1),
  (SELECT 
    jsonb_combine((SELECT json_object_agg(s.id, row_to_json(_)) FROM (SELECT s.quantity, s.size) AS _)::jsonb) AS skus
  FROM
    sku AS s
    WHERE s.style_id = 1)
FROM style WHERE product_id = 1;
-----------------------------------------------------

-- Left Join
SELECT * FROM person
LEFT JOIN car ON car.id = person.car_id; 