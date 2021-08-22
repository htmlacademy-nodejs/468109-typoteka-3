'use strict';

const axios = require(`axios`);

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

  async getCategory(id) {
    return this._load(`/category/${id}`);
  }

  async getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  async getComments(id) {
    return this._load(`/article/${id}/comments`);
  }

  async getLastComments(count) {
    return this._load(`/article/comments/`, {params: {count}});
  }

  async createArticle(data) {
    return this._load(`/article`, {
      method: `POST`,
      data
    });
  }

  async updateArticle(data, id) {
    return this._load(`/article/${id}`, {
      method: `PUT`,
      data
    });
  }

  async addCategory(data) {
    return this._load(`/category`, {
      method: `POST`,
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

