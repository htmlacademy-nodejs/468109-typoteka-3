'use strict';

const defineModels = require(`../models`);
const Aliases = require(`../constants/aliases`);

module.exports = async (sequelize, {articles, categories, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  let userModels = await User.bulkCreate(users, {include: [Aliases.ARTICLES, Aliases.COMMENTS]});

  const categoryIdByName = categoryModels.reduce((res, category) => ({
    [category.name]: category.id,
    ...res
  }), {});

  const userIdByEmail = userModels.reduce((res, user) => ({
    [user.email]: user.id,
    ...res
  }), {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliases.COMMENTS]});

    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  return Promise.all(articlePromises);
};
