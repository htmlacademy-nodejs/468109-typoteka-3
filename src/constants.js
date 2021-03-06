'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.ExitCode = {
  success: 0
};

module.exports.MAX_ID_LENGTH = 6;

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.SystemError = {
  NOT_FOUND: `ENOENT`
};
