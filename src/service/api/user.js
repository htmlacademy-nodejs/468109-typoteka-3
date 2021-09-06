'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const newUserValidator = require(`../middlewares/new-user-validator`);
const passwordUtils = require(`../lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, newUserValidator(service), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    res.status(StatusCodes.CREATED)
      .json(result);
  });
};
