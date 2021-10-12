'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`./constants`);
const {
  formatMostPopularArticlesToClient,
  formatLastCommentsToClient
} = require(`./utils/formatters`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  getArticles({comments, offset, limit}) {
    return this._load(`/article`, {params: {comments, offset, limit}});
  }

  async getMostPopularArticles(count) {
    const articles = await this._load(`/article/most-popular`, {params: {count}});

    return formatMostPopularArticlesToClient(articles);
  }

  getArticle(id) {
    return this._load(`/article/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategory({id, articles}) {
    return this._load(`/category/${id}`, {params: {articles}});
  }

  async getCategories({count, limit, offset}) {
    return this._load(`/category`, {params: {count, limit, offset}});
  }

  async getUsedCategories() {
    return this._load(`/category/used`);
  }

  async getAllComments() {
    return this._load(`/article/all-comments`);
  }

  async getLastComments(count) {
    const comments = await this._load(`/article/comments/`, {params: {count}});

    return formatLastCommentsToClient(comments);
  }

  createComment(data, id) {
    return this._load(`/article/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteComment(articleId, commentId) {
    return this._load(`/article/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

  async createArticle(data) {
    return this._load(`/article`, {
      method: HttpMethod.POST,
      data
    });
  }

  async updateArticle(data, id) {
    return this._load(`/article/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async deleteArticle(id) {
    return this._load(`/article/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async addCategory(data) {
    return this._load(`/category`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteCategory(id) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async updateCategory(id, data) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});

    return response.data;
  }
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

