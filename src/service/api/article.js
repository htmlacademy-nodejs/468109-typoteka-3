'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {articleKeys, commentKeys, entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entityValidator`);
const articleExists = require(`../middlewares/articleExists`);
const commentExists = require(`../middlewares/commentExists`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/article`, route);

  route.get(
      `/`,
      (req, res) => {
        const articles = service.findAll();

        return res.status(StatusCodes.OK)
          .json(articles);
      });

  route.post(
      `/`,
      entityValidator(articleKeys, entityNames.ARTICLE),
      (req, res) => {
        const article = service.create(req.body);

        return res.status(StatusCodes.CREATED)
          .json(article);
      });

  route.get(
      `/:articleId`,
      articleExists(service),
      (req, res) => {
        const {article} = res.locals;

        return res.status(StatusCodes.OK)
          .json(article);
      });

  route.put(
      `/:articleId`,
      [articleExists(service), entityValidator(articleKeys, entityNames.ARTICLE)],
      (req, res) => {
        const {articleId} = req.params;

        const newArticle = service.update(articleId, req.body);

        return res.status(StatusCodes.OK)
          .json(newArticle);
      });

  route.delete(
      `/:articleId`,
      articleExists(service),
      (req, res) => {
        const {articleId} = req.params;

        const deletedArticle = service.drop(articleId);

        return res.status(StatusCodes.OK)
          .json(deletedArticle);
      });

  route.get(
      `/:articleId/comments`,
      articleExists(service),
      (req, res) => {
        const {article} = res.locals;

        const comments = service.findAllComments(article);

        return res.status(StatusCodes.OK)
          .json(comments);
      });

  route.post(
      `/:articleId/comments/`,
      [articleExists(service), entityValidator(commentKeys, entityNames.COMMENT)],
      (req, res) => {
        const {article} = res.locals;

        const newComment = service.createComment(article, req.body);

        return res.status(StatusCodes.CREATED)
          .json(newComment);
      });

  route.delete(
      `/:articleId/comments/:commentId`,
      [articleExists(service), commentExists(service), entityValidator(commentKeys, entityNames.COMMENT)],
      (req, res) => {
        const {article} = res.locals;
        const {commentId} = req.params;

        const deletedComment = service.dropComment(article, commentId);

        return res.status(StatusCodes.OK)
          .json(deletedComment);
      });
};
