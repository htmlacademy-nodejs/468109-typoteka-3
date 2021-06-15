'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

const searchKeys = [`query`];

module.exports = (req, res, next) => {
  const keys = Object.keys(req.query);
  const keysExists = searchKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST);
  }

  next();
};
