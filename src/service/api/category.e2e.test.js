'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {mockArticles} = require(`../constants/mocksData`);

const app = express();
app.use(express.json());
category(app, new DataService(mockArticles));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are "Программирование", "Без рамки", "Железо", "IT", "Музыка", "Разное", "Кино", "За жизнь", "Деревья"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Программирование`, `Без рамки`, `Железо`, `IT`, `Музыка`, `Разное`, `Кино`, `За жизнь`, `Деревья`])
      )
  );
});
