'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => (req, res, next) => {
  const {commentId} = req.params;
  const {article} = res.locals;
  const comment = service.findOneComment(article, commentId);

  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
