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

  getArticles() {
    return this._load(`/article`);
  }

  getArticle(id) {
    return this._load(`/article/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return this._load(`/category`);
  }

  async getComments(id) {
    return this._load(`/article/${id}/comments`);
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
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

