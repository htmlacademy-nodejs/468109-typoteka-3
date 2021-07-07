'use strict';

const chalk = require(`chalk`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliases = require(`../constants/aliases`);

const {
  getRandomInt,
  getRandomDate,
  shuffle,
  readContent,
  getRandomSubarray
} = require(`../../utils`);

const {logger} = require(`../lib/logger`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_SENTENCES_PATH = `src/data/sentences.txt`;
const FILE_TITLES_PATH = `src/data/titles.txt`;
const FILE_CATEGORIES_PATH = `src/data/categories.txt`;
const FILE_COMMENTS_PATH = `src/data/comments.txt`;
const MAX_DATE = Date.now();
const MIN_DATE = new Date(MAX_DATE).setMonth(new Date(MAX_DATE).getMonth() - 3);

const MAX_COUNT = 1000;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count, titles, sentences, categories, comments) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    publicationDate: new Date(getRandomDate(MIN_DATE, MAX_DATE)),
    announce: shuffle(sentences).slice(0, getRandomInt(1, 3)).join(` `).substr(0, 249),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `).substr(0, 1000),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }));
};

const runGenerateData = async (args) => {
  const [count] = args;
  const countData = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countData > MAX_COUNT) {
    return console.error(chalk.red(`Не больше 1000 публикаций`));
  }

  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  }

  logger.info(`Connection to database established`);

  const {Category, Article, Comment} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const [sentences, titles, categories, comments] = await Promise.all([
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_COMMENTS_PATH)
  ]);

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const articles = generatePublications(countData, titles, sentences, categoryModels, comments);

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliases.COMMENTS]});
    const commentModels = await Comment.bulkCreate(
        article.comments.map((item) => ({text: item.text}))
    );

    await articleModel.addCategories(article.categories);
    await articleModel.addComments(commentModels);
  });

  return await Promise.all(articlePromises);
};

module.exports = {
  name: `--filldb`,
  run(args) {
    runGenerateData(args);
  }
};
