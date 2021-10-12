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

const getUniqueEntitiesArray = (data, field) => {
  if (!data || !data.length) {
    return [];
  }

  return data.reduce((result, item) => {
    const entities = item[field];

    if (!entities) {
      return result;
    }

    return [...new Set([...result, ...entities])];
  }, []);
};

const extendEntity = (entity, data, extensions) => {
  const additionalData = {};

  extensions.forEach((extension) => {
    if (data[extension]) {
      additionalData[extension] = data[extension];
    }
  });

  return {
    ...entity,
    ...additionalData
  };
};

const getExtendedEntitiesArray = (data, field, extensions = []) => {
  if (!data || !data.length) {
    return [];
  }

  return data.reduce((result, item) => {
    const entities = item[field];

    if (!entities) {
      return result;
    }

    const extendedEntities = entities.map((entity) => {
      return extendEntity(entity, item, extensions);
    });

    return [...result, ...extendedEntities];
  }, []);
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(getRandomInt(0, items.length - 1), 1)
    );
  }
  return result;
};

const trimString = (string, length, ending) => {
  const DEFAULT_ENDING = `...`;

  const updatedEnding = ending || DEFAULT_ENDING;

  if (!string) {
    return ``;
  }

  if (string.length <= length) {
    return string;
  }

  return string.slice(0, length) + updatedEnding;
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate,
  readContent,
  checkTextMatch,
  getUniqueEntitiesArray,
  getExtendedEntitiesArray,
  getRandomSubarray,
  trimString
};
