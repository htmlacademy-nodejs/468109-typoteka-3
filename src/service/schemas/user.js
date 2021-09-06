'use strict';

const Joi = require(`joi`);

const namePattern = /[^0-9$&+,:;=?@#|'<>.^*()%!]+/;

module.exports = Joi.object({
  name: Joi.string().pattern(namePattern).required(),
  surname: Joi.string().pattern(namePattern).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)),
});
