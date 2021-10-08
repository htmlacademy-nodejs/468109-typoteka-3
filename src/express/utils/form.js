'use strict';

const extractCategories = (data) => {
  const keys = Object.keys(data);

  return keys.reduce((res, item) => {
    if (item.indexOf(`category`) !== -1) {
      return [...res, item.split(`-`)[1]];
    }

    return res;
  }, []);
};

module.exports = {
  extractCategories
};
