'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const asyncHandler = require(`express-async-handler`);

const {articleKeys, commentKeys, entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entityValidator`);
const articleExists = require(`../middlewares/articleExists`);
const commentExists = require(`../middlewares/commentExists`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/article`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await service.findAll(comments);

    return res.status(StatusCodes.OK)
      .json(articles);
  });

  route.post(`/`, entityValidator(articleKeys, entityNames.ARTICLE), asyncHandler(async (req, res) => {
    const article = await service.create(req.body);

    return res.status(StatusCodes.CREATED)
      .json(article);
  }));

  route.get(`/comments`, asyncHandler(async (req, res) => {
    const {count} = req.query;

    const comments = await service.findLastComments(count);

    return res.status(StatusCodes.OK)
      .json(comments);
  }));

  route.get(`/:articleId`, articleExists(service), asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const article = await service.findOne(articleId);

    return res.status(StatusCodes.OK)
      .json(article);
  }));

  route.put(`/:articleId`, [articleExists(service), entityValidator(articleKeys, entityNames.ARTICLE)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const newArticle = await service.update(articleId, req.body);

    return res.status(StatusCodes.OK)
      .json(newArticle);
  }));

  route.delete(`/:articleId`, articleExists(service), asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = await service.drop(articleId);

    return res.status(StatusCodes.OK)
      .json(deletedArticle);
  }));

  route.get(`/:articleId/comments`, articleExists(service), asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const comments = await service.findAllComments(articleId);

    return res.status(StatusCodes.OK)
      .json(comments);
  }));

  route.post(`/:articleId/comments/`, [articleExists(service), entityValidator(commentKeys, entityNames.COMMENT)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const newComment = await service.createComment(articleId, req.body);

    return res.status(StatusCodes.CREATED)
      .json(newComment);
  }));

  route.delete(`/:articleId/comments/:commentId`, [articleExists(service), commentExists(service), entityValidator(commentKeys, entityNames.COMMENT)], asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await service.dropComment(commentId);

    return res.status(StatusCodes.OK)
      .json(deletedComment);
  }));
};
