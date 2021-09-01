'use strict';

const {StatusCodes} = require(`http-status-codes`);

const getNewEntity = (entity, body) => {
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length > 0) {
    return body;
  }

  if (entity) {
    return entity;
  }

  return {};
};

module.exports = (schema, entityName) => async (req, res, next) => {
  const entity = res.locals[entityName];
  const newEntity = getNewEntity(entity, req.body);

  try {
    await schema.validateAsync(newEntity, {abortEarly: false});
  } catch (err) {
    const {details} = err;

    res.status(StatusCodes.BAD_REQUEST).json({
      message: details.map((errorDescription) => ({
        name: errorDescription.context.label,
        text: errorDescription.message
      })),
      data: newEntity
    });
    return;
  }

  next();
};
