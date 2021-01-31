'use strict';

const server = require(`./server`);
const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);

const Cli = {
  [server.name]: server,
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  Cli,
};
