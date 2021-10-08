'use strict';

const {hash, compare} = require(`bcrypt`);

const SALT_ROUNDS = 10;

module.exports = {
  hash: (password) => hash(password, SALT_ROUNDS),
  compare
};
