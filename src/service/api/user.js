'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const asyncHandler = require(`express-async-handler`);

const newUserValidator = require(`../middlewares/new-user-validator`);
const passwordUtils = require(`../lib/password`);

const route = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, newUserValidator(service), asyncHandler(async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    res.status(StatusCodes.CREATED)
      .json(result);
  }));

  route.post(`/auth`, asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

    if (passwordIsCorrect) {
      delete user.passwordHash;
      res.status(StatusCodes.OK).json(user);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  }));
};
