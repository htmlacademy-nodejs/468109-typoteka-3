'use strict';
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = (min, max) => {
  const diff = max - min;

  return min + getRandomInt(0, diff);
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const checkTextMatch = (search, text) => {
  if (!search || !text) {
    return false;
  }

  const reg = new RegExp(search.trim(), `gi`);

  return reg.test(text);
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate,
  readContent,
  checkTextMatch
};
