'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const searchRouter = new Router();
const api = getAPI();

searchRouter.get(`/`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    console.log(`results`, results);

    res.render(`search`, {
      results
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

module.exports = searchRouter;
