'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const asyncHandler = require(`express-async-handler`);

const {entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entity-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentExists = require(`../middlewares/comment-exists`);
const articleSchema = require(`../schemas/article`);
const commentSchema = require(`../schemas/comment`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/article`, route);

  route.get(`/`, async (req, res) => {
    const {comments, offset, limit} = req.query;
    let articles;

    if (offset || limit) {
      articles = await service.findPage({comments, limit, offset});
    } else {
      articles = await service.findAll(comments);
    }

    return res.status(StatusCodes.OK)
      .json(articles);
  });

  route.post(`/`, entityValidator(articleSchema, entityNames.ARTICLE), asyncHandler(async (req, res) => {
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

  route.put(`/:articleId`, [articleExists(service), entityValidator(articleSchema, entityNames.ARTICLE)], asyncHandler(async (req, res) => {
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

  route.post(`/:articleId/comments/`, [articleExists(service), entityValidator(commentSchema, entityNames.COMMENT)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const newComment = await service.createComment(articleId, req.body);

    return res.status(StatusCodes.CREATED)
      .json(newComment);
  }));

  route.delete(`/:articleId/comments/:commentId`, [articleExists(service), commentExists(service), entityValidator(commentSchema, entityNames.COMMENT)], asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await service.dropComment(commentId);

    return res.status(StatusCodes.OK)
      .json(deletedComment);
  }));
};
