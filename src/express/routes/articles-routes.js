'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const csrf = require(`csurf`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {extractCategories} = require(`../utils/form`);

const articlesRouter = new Router();
const api = getAPI();
const csrfProtection = csrf();

const renderNewPost = asyncHandler(async (req, res, meta) => {
  const {user} = req.session;
  const {errors, article, editMode} = meta;
  const categories = await api.getCategories({});

  res.render(`new-post`, {article, errors, categories, editMode, user, csrfToken: req.csrfToken()});
});

const renderPost = asyncHandler(async (req, res, meta = {}) => {
  const {user} = req.session;
  const {id} = req.params;
  const {errors} = meta;
  const article = await api.getArticle(id);

  res.render(`post`, {article, errors, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/category/:id`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const [category, categories] = await Promise.all([
    api.getCategory({id, articles: true}),
    api.getCategories(true),
  ]);

  return res.render(`articles-by-category`, {categories, category, articles: category.articles, user});
}));

articlesRouter.get(`/add`, [auth(true), csrfProtection], renderNewPost);

articlesRouter.post(`/add`, [auth(true), upload.single(`photo`), csrfProtection], asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const categoriesIds = extractCategories(body);

  const articleData = {
    publicationDate: body.date,
    title: body.title,
    photo: file ? file.filename : body.photo,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: categoriesIds,
    userId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const meta = {
      article: {...articleData, categoriesIds},
      errors: err.response.data.message
    };

    renderNewPost(req, res, meta);
  }
}));

articlesRouter.get(`/edit/:id`, [auth(true), csrfProtection], asyncHandler(async (req, res) => {
  const {id} = req.params;

  const meta = {
    article: await api.getArticle(id),
    editMode: true
  };

  renderNewPost(req, res, meta);
}));

articlesRouter.post(`/edit/:id`, [auth(true), upload.single(`photo`), csrfProtection], asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const categoriesIds = extractCategories(body);

  const articleData = {
    publicationDate: body.date,
    title: body.title,
    photo: file ? file.filename : body.photo,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: categoriesIds,
    userId: user.id

  };
  const {id} = req.params;

  try {
    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (err) {

    const meta = {
      errors: err.response.data.message,
      article: {
        id,
        ...articleData,
        categoriesIds
      },
      editMode: true
    };

    renderNewPost(req, res, meta);
  }
}));

articlesRouter.get(`/:id`, csrfProtection, renderPost);

articlesRouter.post(`/:id/comments`, [auth(true), csrfProtection], asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    text: message,
    userId: user.id
  };

  try {
    await api.createComment(newComment, id);

    renderPost(req, res);
  } catch (err) {
    const meta = {
      errors: err.response.data.message,
    };

    renderPost(req, res, meta);
  }
}));

module.exports = articlesRouter;
