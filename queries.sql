SELECT id, name FROM categories;

SELECT id, name FROM categories
  JOIN articles_categories
  ON id = category_id
  GROUP BY id;

SELECT id, name, count(article_id) AS categories_count FROM categories
  LEFT JOIN articles_categories
  ON id = category_id
  GROUP BY id;

SELECT
  articles.id,
  title,
  announce,
  publication_date,
  concat(users.first_name, ' ', users.last_name) AS user_name,
  users.email,
  count(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_name
FROM articles
  JOIN users ON articles.user_id = users.id
  LEFT JOIN comments ON articles.id = comments.article_id
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON categories.id = articles_categories.category_id
  GROUP BY articles.id, users.id
  ORDER BY articles.publication_date DESC;

SELECT
  articles.*,
  concat(users.first_name, ' ', users.last_name) AS user_name,
  users.email,
  count(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_name
FROM articles
  JOIN users ON articles.user_id = users.id
  LEFT JOIN comments ON articles.id = comments.article_id
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON categories.id = articles_categories.category_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id;

SELECT
  comments.id,
  comments.article_id,
  concat(users.first_name, ' ', users.last_name) AS user_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5;

SELECT
  comments.id,
  comments.article_id,
  concat(users.first_name, ' ', users.last_name) AS user_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 3
  ORDER BY comments.created_at DESC;

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 2;
