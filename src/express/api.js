'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`./constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});

    return response.data;
  }

  getArticles({comments, offset, limit}) {
    return this._load(`/article`, {params: {comments, offset, limit}});
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

  async getComments(id) {
    return this._load(`/article/${id}/comments`);
  }

  async getLastComments(count) {
    return this._load(`/article/comments/`, {params: {count}});
  }

  createComment(data, id) {
    return this._load(`/article/${id}/comments`, {
      method: HttpMethod.POST,
      data
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
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

