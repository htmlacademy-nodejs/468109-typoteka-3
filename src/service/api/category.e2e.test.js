'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {mockArticles, mockCategories} = require(`../constants/mocksData`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});

  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of ${mockCategories.length} categories`, () => expect(response.body.length).toBe(mockCategories.length));
  test(`Category names are ${mockCategories.toString()}`,
      () => expect(response.body.map((item) => item.name)).toEqual(
          expect.arrayContaining(mockCategories)
      )
  );
});
