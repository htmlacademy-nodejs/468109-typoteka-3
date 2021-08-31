'use strict';

const Sequelize = require(`sequelize`);
const Aliases = require(`../constants/aliases`);

class CategoryService {
  constructor(orm) {
    this._Categories = orm.models.Category;
    this._ArticlesCategory = orm.models.ArticlesCategory;
  }

  async findAll(isNeedCount) {
    if (isNeedCount) {
      const result = await this._Categories.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(`COUNT`, `*`),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticlesCategory,
          as: Aliases.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((category) => category.get());
    } else {
      return this._Categories.findAll({raw: true});
    }
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Categories.findAndCountAll({
      limit,
      offset,
      distinct: true
    });
    return {count, categories: rows};
  }

  async findOne(id) {
    return this._Categories.findByPk(id);
  }

  async createCategory(categoryData) {
    return this._Categories.create(categoryData);
  }
}

module.exports = CategoryService;
