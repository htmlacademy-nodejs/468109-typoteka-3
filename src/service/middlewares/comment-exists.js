'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => async (req, res, next) => {
  const {commentId} = req.params;
  const {article} = res.locals;
  const comment = await service.findOneComment(article.id, commentId);

  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
