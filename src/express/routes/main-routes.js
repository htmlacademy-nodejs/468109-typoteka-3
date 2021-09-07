'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);

const mainRouter = new Router();
const api = getAPI();

const ARTICLES_PER_PAGE = 8;

const renderSignUp = (req, res, meta = {}) => {
  const {user, errors} = meta;

  res.render(`sign-up`, {user, errors});
};

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  let {page = 1} = req.query;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories, comments] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true),
    api.getLastComments(3)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, comments, page, totalPages});
}));

mainRouter.get(`/register`, renderSignUp);

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    name: body.name,
    surname: body.surname,
    avatar: file ? file.filename : ``,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const meta = {
      errors: err.response.data.message,
      user: {
        name: userData.name,
        surname: userData.surname,
        avatar: userData.avatar,
        email: userData.email,
      }
    };

    renderSignUp(req, res, meta);
  }
});

module.exports = mainRouter;
