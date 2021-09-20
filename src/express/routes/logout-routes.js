'use strict';

const {Router} = require(`express`);

const logoutRouter = new Router();

logoutRouter.get(`/`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = logoutRouter;
