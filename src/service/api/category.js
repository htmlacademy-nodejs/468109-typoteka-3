'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/category`, route);

  route.get(
      `/`,
      (req, res) => {
        const categories = service.findAll();
        res.status(StatusCodes.OK)
          .json(categories);
      });
};
