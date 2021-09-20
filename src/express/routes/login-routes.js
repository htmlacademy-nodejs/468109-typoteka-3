'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const loginRouter = new Router();
const api = getAPI();

loginRouter.get(`/`, (req, res) => res.render(`login`));

loginRouter.post(`/`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;

    req.session.user.isAdmin = user.id === 3;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    res.render(`login`, {user: req.body, error: error.response.data});
  }
});

loginRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = loginRouter;
