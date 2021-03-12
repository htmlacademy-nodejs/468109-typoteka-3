'use strict';

const {checkTextMatch} = require(`../../utils`);

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(search) {
    return this._articles.filter((item) => checkTextMatch(search, item.title));
  }
}

module.exports = SearchService;
