'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string().min(30).max(250).required(),
  publicationDate: Joi.string().isoDate().required(),
  announce: Joi.string().min(30).max(250).required(),
  fullText: Joi.string().max(1000),
  categories: Joi.array().items(Joi.string()).min(1).required()
});
