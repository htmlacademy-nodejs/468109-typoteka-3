'use strict';

const {Op} = require(`sequelize`);

const Aliases = require(`../constants/aliases`);

class SearchService {
  constructor(orm) {
    this._Articles = orm.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Articles.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliases.CATEGORIES]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
