'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  getRandomDate,
  shuffle,
  readContent
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `src/data/sentences.txt`;
const FILE_TITLES_PATH = `src/data/titles.txt`;
const FILE_CATEGORIES_PATH = `src/data/categories.txt`;
const FILE_COMMENTS_PATH = `src/data/comments.txt`;
const MAX_DATE = Date.now();
const MIN_DATE = new Date(MAX_DATE).setMonth(new Date(MAX_DATE).getMonth() - 3);

const MAX_COUNT = 1000;

const defaultUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const generateComments = (count, articleId, userCount, comments) => {
  return Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generatePublications = (count, titles, categoryCount, userCount, sentences, comments) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publicationDate: new Date(getRandomDate(MIN_DATE, MAX_DATE)),
    userId: getRandomInt(1, userCount),
    announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments)
  }));
};

const runFillData = async (args) => {
  const [sentences, titles, categories, commentSentences] = await Promise.all([
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_COMMENTS_PATH)
  ]);
  const [count] = args;
  const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countArticles > MAX_COUNT) {
    return console.error(chalk.red(`Не больше 1000 публикаций`));
  }

  const articles = generatePublications(countArticles, titles, categories.length, defaultUsers.length, sentences, commentSentences);
  const comments = articles.reduce((res, article) => res.concat(article.comments), []);
  const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

  const userValues = defaultUsers.map(
      ({email, passwordHash, firstName, lastName, avatar}) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
  ).join(`,\n`);

  const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

  const articleValues = articles.map(
      ({title, publicationDate, userId, announce, fullText}) =>
        `('${title}', '${publicationDate}', '${userId}', '${announce}', '${fullText}')`
  ).join(`,\n`);

  const articleCategoryValues = articleCategories.map(
      ({articleId, categoryId}) =>
        `(${articleId}, ${categoryId})`
  ).join(`,\n`);

  const commentValues = comments.map(
      ({text, userId, articleId}) =>
        `('${text}', ${userId}, ${articleId})`
  ).join(`,\n`);

  const content = `
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ${userValues};
    INSERT INTO categories(name) VALUES
    ${categoryValues};
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, publication_date, user_id, announce, full_text) VALUES
    ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;
    ALTER TABLE articles_categories DISABLE TRIGGER ALL;
    INSERT INTO articles_categories(article_id, category_id) VALUES
    ${articleCategoryValues};
    ALTER TABLE articles_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO COMMENTS(text, user_id, article_id) VALUES
    ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;
  `;

  try {
    await fs.writeFile(FILE_NAME, content);

    return console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return console.error(chalk.red(`Can't write data to file...`));
  }
};

module.exports = {
  name: `--fill`,
  run(args) {
    runFillData(args);
  }
};
