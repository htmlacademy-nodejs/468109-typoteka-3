'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

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

module.exports = (entityKeys, entityName) => (req, res, next) => {
  const entity = res.locals[entityName];
  const newEntity = getNewEntity(entity, req.body);
  const keys = Object.keys(newEntity);
  const keysExists = entityKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST);
  }

  return next();
};
