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

// module.exports = (entityKeys, entityName) => (req, res, next) => {
//   const entity = res.locals[entityName];
//   const newEntity = getNewEntity(entity, req.body);
//   const keys = Object.keys(newEntity);
//   const keysExists = entityKeys.every((key) => keys.includes(key));
//
//   if (!keysExists) {
//     return res.status(StatusCodes.BAD_REQUEST)
//       .send(ReasonPhrases.BAD_REQUEST);
//   }
//
//   return next();
// };

module.exports = (schema, entityName) => async (req, res, next) => {
  const entity = res.locals[entityName];
  const newEntity = getNewEntity(entity, req.body);

  try {
    await schema.validateAsync(newEntity, {abortEarly: false});
  } catch (err) {
    const {details} = err;

    res.status(StatusCodes.BAD_REQUEST).json({
      message: details.map((errorDescription) => errorDescription.message),
      data: newEntity
    });
    return;
  }

  next();
};
