'use strict';

const server = require(`./server`);
const help = require(`./help`);
const fillDb = require(`./filldb`);
const fill = require(`./fill`);
const version = require(`./version`);

const Cli = {
  [server.name]: server,
  [fillDb.name]: fillDb,
  [fill.name]: fill,
  [help.name]: help,
  [version.name]: version,
};

module.exports = {
  Cli,
};
