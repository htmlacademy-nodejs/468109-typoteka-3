'use strict';

const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);

const Aliases = require(`../constants/aliases`);

class CategoryService {
  constructor(orm) {
    this._Article = orm.models.Article;
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

  async findUsedCategories() {
    const categories = await this._Categories.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      having: Sequelize.where(
          Sequelize.fn(
              `COUNT`,
              Sequelize.col(`CategoryId`)
          ),
          {
            [Op.gte]: 1
          }
      ),
      include: [{
        model: this._ArticlesCategory,
        as: Aliases.ARTICLES_CATEGORIES,
        attributes: []
      }]
    });

    return categories.map((category) => category.get());
  }

  async findOne({id, articles}) {
    let include = [];

    if (articles) {
      include.push({
        model: this._Article,
        as: Aliases.ARTICLES,
        include: [Aliases.CATEGORIES, Aliases.COMMENTS]
      });
    }

    return this._Categories.findByPk(id, {include});
  }

  async drop(id) {
    return this._Categories.destroy({
      where: {id}
    });
  }

  async update(id, category) {
    return this._Categories.update(category, {
      where: {id}
    });
  }

  async createCategory(categoryData) {
    return this._Categories.create(categoryData);
  }
}

module.exports = CategoryService;
