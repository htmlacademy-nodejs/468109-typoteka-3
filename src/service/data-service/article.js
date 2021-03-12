'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

  findAllComments(article) {
    return article.comments;
  }

  findOneComment(article, commentId) {
    return article.comments.find((item) => item.id === commentId);
  }

  createComment(article, comment) {
    const createdComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    const newComments = article.comments.concat(createdComment);

    this.update(article.id, {comments: newComments});

    return createdComment;
  }

  dropComment(article, commentId) {
    const droppedComment = this.findOneComment(article, commentId);

    const newComments = article.comments.filter((item) => item.id !== commentId);

    this.update(article.id, {comments: newComments});

    return droppedComment;
  }
}

module.exports = ArticleService;
