'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Aliases = require(`../constants/aliases`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

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

  User.hasMany(Article, {as: Aliases.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Aliases.USER, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliases.USER, foreignKey: `userId`});

  return {Category, Comment, Article, ArticlesCategory, User};
};

module.exports = define;
