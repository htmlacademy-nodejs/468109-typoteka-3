'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const {extractCategories} = require(`../utils/form`);

const articlesRouter = new Router();
const api = getAPI();

const renderNewPost = asyncHandler(async (req, res, meta) => {
  const {errors, article, editMode} = meta;
  const categories = await api.getCategories({});

  res.render(`new-post`, {article, errors, categories, editMode});
});

const renderPost = asyncHandler(async (req, res, meta = {}) => {
  const {id} = req.params;
  const {errors} = meta;
  const article = await api.getArticle(id);

  res.render(`post`, {article, errors});
});

articlesRouter.get(`/category/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;

  const [articles, categories, category] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true),
    api.getCategory(id)
  ]);

  return res.render(`articles-by-category`, {articles, categories, category});
}));

articlesRouter.get(`/add`, renderNewPost);

articlesRouter.post(`/add`, upload.single(`photo`), asyncHandler(async (req, res) => {
  const {body, file} = req;

  const articleData = {
    publicationDate: body.date,
    title: body.title,
    photo: file ? file.filename : ``,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: extractCategories(body)
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const meta = {
      article: articleData,
      errors: err.response.data.message
    };

    renderNewPost(req, res, meta);
  }
}));

articlesRouter.get(`/edit/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;

  const meta = {
    article: await api.getArticle(id),
    editMode: true
  };

  renderNewPost(req, res, meta);
}));

articlesRouter.post(`/edit/:id`, asyncHandler(async (req, res) => {
  const {body} = req;
  const articleData = {
    publicationDate: body.date,
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: body.category
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
        ...articleData
      },
      editMode: true
    };

    renderNewPost(req, res, meta);
  }
}));

articlesRouter.get(`/:id`, renderPost);

articlesRouter.post(`/:id/comments`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    text: message
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
