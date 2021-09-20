'use strict';

const Sequelize = require(`sequelize`);
const Aliases = require(`../constants/aliases`);

const DEFAULT_COMMENTS_COUNT = 5;

class ArticleService {
  constructor(orm) {
    this._Article = orm.models.Article;
    this._Comment = orm.models.Comment;
    this._User = orm.models.User;
    this._Category = orm.models.Category;
    this._ArticlesCategory = orm.models.ArticlesCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);

    await article.addCategories(articleData.categories);

    return !!article;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USER,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({include});

    return articles.map((article) => article.get());
  }

  findOne(id) {
    return this._Article.findByPk(id, {
      include: [
        Aliases.CATEGORIES,
        {
          model: this._User,
          as: Aliases.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
        {
          model: this._Comment,
          as: Aliases.COMMENTS,
          include: [
            {
              model: this._User,
              as: Aliases.USER,
              attributes: {
                exclude: [`passwordHash`]
              }
            }
          ]
        }
      ]},
    ).then((model) => {
      if (!model) {
        return model;
      }

      const article = model.get();

      return {
        ...article,
        categoriesIds: article.categories.map((category) => category.id)
      };
    });
  }

  async findMostPopular(count) {
    const results = await this._Article.findAll({
      limit: count,
      attributes: [
        `id`,
        `announce`,
        [Sequelize.fn(`COUNT`, `*`), `comments_count`]
      ],
      include: [{
        model: this._Comment,
        as: Aliases.COMMENTS,
        attributes: []
      }],
      group: [`Article.id`],
      order: [
        [Sequelize.literal(`comments_count`), `DESC`],
      ],
      subQuery: false
    });

    return results.map((article) => article.get());
  }

  async update(id, articleData) {
    const [updatedRows] = await this._Article.update(articleData, {
      where: {id}
    });

    const updatedArticle = await this._Article.findOne({
      where: {
        id
      }
    });

    await updatedArticle.setCategories(articleData.categories);

    return !!updatedRows;
  }

  findCommentsById(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findLastComments(count) {
    const commentsCount = count || DEFAULT_COMMENTS_COUNT;

    return this._Comment.findAll({
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        {
          model: this._User,
          as: Aliases.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      limit: commentsCount
    });
  }

  findAllComments() {
    return this._Comment.findAll({
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        {
          model: this._User,
          as: Aliases.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ]
    });
  }

  findOneComment(articleId, commentId) {
    return this._Comment.findOne({
      where: {articleId, id: commentId},
      raw: true
    });
  }

  createComment(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  dropComment(commentId) {
    const deletedRows = this._Comment.destroy({
      where: {id: commentId}
    });
    return !!deletedRows;
  }

  async findPage({limit, offset, comments}) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (comments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USER,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      order: [
        [`createdAt`, `DESC`]
      ],
      include,
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = ArticleService;
