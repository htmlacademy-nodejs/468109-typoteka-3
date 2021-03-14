'use strict';

const fs = require(`fs`);
const FILENAME = `mocks.json`;
let data = null;

const getMockData = () => {
  if (data) {
    return data;
  }

  try {
    const fileContent = fs.readFileSync(FILENAME);

    if (fileContent.length === 0) {
      data = [];
    }

    data = JSON.parse(fileContent);
  } catch (err) {
    throw err;
  }

  return data;
};

module.exports = {
  getMockData
};
