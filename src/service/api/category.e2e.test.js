'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {mockArticles} = require(`../constants/mocksData`);
const {getUniqueEntitiesArray} = require(`../../utils`);

const app = express();
app.use(express.json());
category(app, new DataService(mockArticles));

describe(`API returns category list`, () => {
  let response;
  const categoriesList = getUniqueEntitiesArray(mockArticles, `category`);

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of ${categoriesList.length} categories`, () => expect(response.body.length).toBe(categoriesList.length));
  test(`Category names are ${categoriesList.toString()}`,
      () => expect(response.body).toEqual(
          expect.arrayContaining(categoriesList)
      )
  );
});
