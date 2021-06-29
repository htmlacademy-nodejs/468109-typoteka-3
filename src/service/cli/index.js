'use strict';

const server = require(`./server`);
const help = require(`./help`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const version = require(`./version`);

const Cli = {
  [server.name]: server,
  [generate.name]: generate,
  [fill.name]: fill,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  Cli,
};
