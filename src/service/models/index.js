'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const Aliases = require(`../constants/aliases`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  class ArticlesCategory extends Model {}
  ArticlesCategory.init({}, {
    sequelize,
    tableName: Aliases.ARTICLES_CATEGORIES
  });

  Article.belongsToMany(Category, {through: ArticlesCategory, as: Aliases.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticlesCategory, as: Aliases.ARTICLES});
  Category.hasMany(ArticlesCategory, {as: Aliases.ARTICLES_CATEGORIES});

  return {Category, Comment, Article, ArticlesCategory};
};

module.exports = define;
