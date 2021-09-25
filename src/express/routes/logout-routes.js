'use strict';

const {Router} = require(`express`);

const logoutRouter = new Router();

logoutRouter.get(`/`, (req, res) => {
  req.session.destroy();
  res.redirect(`/`);
});

module.exports = logoutRouter;
