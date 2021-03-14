'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((res, offer) => {
      offer.category.forEach((category) => res.add(category));
      return res;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
