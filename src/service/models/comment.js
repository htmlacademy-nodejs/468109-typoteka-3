'use strict';

const {DataTypes, Model} = require(`sequelize`);

const define = (sequelize) => {
  class Comment extends Model {}

  Comment.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  });

  return Comment;
};

module.exports = define;
