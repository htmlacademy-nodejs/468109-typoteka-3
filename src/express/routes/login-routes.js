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

    req.session.user.isAdmin = user.id === 1;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    res.render(`login`, {userData: req.body, error: error.response.data});
  }
});

module.exports = loginRouter;
