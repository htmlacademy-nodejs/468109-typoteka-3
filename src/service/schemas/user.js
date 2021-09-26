'use strict';

const Joi = require(`joi`);

const namePattern = /^[a-zа-яё]+$/i;

module.exports = Joi.object({
  name: Joi.string().min(1).pattern(namePattern).required(),
  surname: Joi.string().min(1).pattern(namePattern).required(),
  avatar: Joi.string().optional().empty(``),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)),
});
