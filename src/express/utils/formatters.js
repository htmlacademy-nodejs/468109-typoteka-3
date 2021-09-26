'use strict';

const {trimString} = require(`../../utils`);

module.exports.formatMostPopularArticlesToClient = (articles) => {
  if (!articles) {
    return articles;
  }

  return articles.map((article) => ({
    ...article,
    announce: trimString(article.announce, 100)
  }));
};

module.exports.formatLastCommentsToClient = (comments) => {
  if (!comments) {
    return comments;
  }

  return comments.map((comment) => ({
    ...comment,
    text: trimString(comment.text, 100)
  }));
};
