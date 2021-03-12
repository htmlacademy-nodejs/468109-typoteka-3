'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(
      `/`,
      (req, res) => {
        const categories = service.findAll();
        res.status(StatusCodes.OK)
          .json(categories);
      });
};
