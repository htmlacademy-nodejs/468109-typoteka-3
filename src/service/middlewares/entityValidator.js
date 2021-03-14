'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

module.exports = (entityKeys, entityName) => (req, res, next) => {
  const entity = res.locals[entityName];
  const newEntity = entity ? Object.assign(entity, req.body) : req.body;
  const keys = Object.keys(newEntity);
  const keysExists = entityKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST);
  }

  return next();
};
