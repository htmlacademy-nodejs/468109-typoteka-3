'use strict';

const {DataTypes, Model} = require(`sequelize`);

const define = (sequelize) => {
  class Article extends Model {}

  Article.init({
    title: {
      type: new DataTypes.STRING(250),
      allowNull: false
    },
    publicationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    announce: {
      type: new DataTypes.STRING(250),
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
    },
    fullText: {
      type: new DataTypes.STRING(1000),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });

  return Article;
};

module.exports = define;
