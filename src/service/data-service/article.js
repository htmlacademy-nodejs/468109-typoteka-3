'use strict';

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
        Aliases.COMMENTS
      ]}
    );
  }

  async update(id, article) {
    const [updatedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!updatedRows;
  }

  findAllComments(articleId) {
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
      limit: commentsCount
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
      include,
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = ArticleService;
