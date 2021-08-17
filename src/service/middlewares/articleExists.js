'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await service.findOne(articleId);

  if (!article) {
    return res.status(StatusCodes.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = article;
  return next();
};
