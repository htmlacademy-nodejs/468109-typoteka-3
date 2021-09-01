'use strict';

const defineModels = require(`../models`);
const Aliases = require(`../constants/aliases`);

module.exports = async (sequelize, {articles, categories}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((res, category) => ({
    [category.name]: category.id,
    ...res
  }), {});

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
