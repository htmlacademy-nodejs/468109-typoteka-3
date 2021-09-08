'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne(categoryId);

  if (!category) {
    return res.status(StatusCodes.NOT_FOUND)
      .send(`Category with ${categoryId} not found`);
  }

  res.locals.category = category;

  return next();
};
