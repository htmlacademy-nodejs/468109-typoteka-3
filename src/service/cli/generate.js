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
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `src/data/sentences.txt`;
const FILE_TITLES_PATH = `src/data/titles.txt`;
const FILE_CATEGORIES_PATH = `src/data/categories.txt`;
const MAX_DATE = Date.now();
const MIN_DATE = new Date(MAX_DATE).setMonth(new Date(MAX_DATE).getMonth() - 3);

const MAX_COUNT = 1000;

const generatePublications = (count, titles, sentences, categories) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(MIN_DATE, MAX_DATE),
    announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `),
    category: [...shuffle(categories).slice(0, getRandomInt(1, categories.length))],
  }));
};

const runGenerateData = async (args) => {
  const sentences = await readContent(FILE_SENTENCES_PATH);
  const titles = await readContent(FILE_TITLES_PATH);
  const categories = await readContent(FILE_CATEGORIES_PATH);
  const [count] = args;
  const countData = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countData > MAX_COUNT) {
    return console.error(chalk.red(`Не больше 1000 публикаций`));
  }

  const content = JSON.stringify(generatePublications(countData, titles, sentences, categories));

  try {
    await fs.writeFile(FILE_NAME, content);

    return console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return console.error(chalk.red(`Can't write data to file...`));
  }
};

module.exports = {
  name: `--generate`,
  run(args) {
    runGenerateData(args);
  }
};
