'use strict';

const Sequelize = require(`sequelize`);
const Aliases = require(`../constants/aliases`);

const DEFAULT_COMMENTS_COUNT = 5;

class ArticleService {
  constructor(orm) {
    this._Article = orm.models.Article;
    this._Comment = orm.models.Comment;
    this._Category = orm.models.Category;
    this._ArticlesCategory = orm.models.ArticlesCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Aliases.CATEGORIES];

    if (needComments) {
      include.push(Aliases.COMMENTS);
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
      where: {articleId, id: commentId}
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
      where: {commentId}
    });
    return !!deletedRows;
  }
}

module.exports = ArticleService;
