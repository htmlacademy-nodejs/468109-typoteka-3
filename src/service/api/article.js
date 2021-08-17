'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

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

  route.post(`/`, entityValidator(articleKeys, entityNames.ARTICLE), async (req, res) => {
    const article = await service.create(req.body);

    return res.status(StatusCodes.CREATED)
      .json(article);
  });

  route.get(`/comments`, async (req, res) => {
    const {count} = req.query;

    const comments = await service.findLastComments(count);

    return res.status(StatusCodes.OK)
      .json(comments);
  });

  route.get(`/:articleId`, articleExists(service), async (req, res) => {
    const {articleId} = req.params;
    const article = await service.findOne(articleId);

    return res.status(StatusCodes.OK)
      .json(article);
  });

  route.put(`/:articleId`, [articleExists(service), entityValidator(articleKeys, entityNames.ARTICLE)], async (req, res) => {
    const {articleId} = req.params;

    const newArticle = await service.update(articleId, req.body);

    return res.status(StatusCodes.OK)
      .json(newArticle);
  });

  route.delete(`/:articleId`, articleExists(service), async (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = await service.drop(articleId);

    return res.status(StatusCodes.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(service), async (req, res) => {
    const {article} = res.locals;

    const comments = await service.findAllComments(article);

    return res.status(StatusCodes.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments/`, [articleExists(service), entityValidator(commentKeys, entityNames.COMMENT)], async (req, res) => {
    const {article} = res.locals;

    const newComment = await service.createComment(article, req.body);

    return res.status(StatusCodes.CREATED)
      .json(newComment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExists(service), commentExists(service), entityValidator(commentKeys, entityNames.COMMENT)], async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    const deletedComment = await service.dropComment(article, commentId);

    return res.status(StatusCodes.OK)
      .json(deletedComment);
  });
};
