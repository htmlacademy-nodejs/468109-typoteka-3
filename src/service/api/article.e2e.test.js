'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const {mockArticles} = require(`../constants/mocksData`);

const createAPI = () => {
  const app = express();

  const clonedData = [...mockArticles];

  app.use(express.json());
  article(app, new DataService(clonedData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/article`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First articles's id equals "cxGQ17"`, () => expect(response.body[0].id).toBe(`cxGQ17`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/article/cxGQ17`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Articles's title is "Как начать программировать"`, () => expect(response.body.title).toBe(`Как начать программировать`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    announce: `Гладим котиков`,
    createdDate: 1621239403082
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/article`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/article`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    announce: `Гладим котиков`,
    createdDate: 1621239403082
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/article`)
        .send(badArticle)
        .expect(StatusCodes.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    announce: `Гладим котиков`,
    createdDate: 1621239403082
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/article/cxGQ17`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/article/cxGQ17`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    announce: `Гладим котиков`,
    createdDate: 1621239403082
  };

  return request(app)
    .put(`/article/NOEXST`)
    .send(validArticle)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    category: `Это`,
    title: `невалидный`,
    fullText: `объект`,
    announce: `нет поля createdDate`,
  };

  return request(app)
    .put(`/article/cxGQ17`)
    .send(invalidArticle)
    .expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/article/cxGQ17`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`cxGQ17`));

  test(`Article count is 4 now`, () => request(app)
    .get(`/article`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/article/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/article/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/article/cxGQ17/comments/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/article/cxGQ17/comments`)
    .send({})
    .expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/article/cxGQ17/comments/4irRMv`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/article/cxGQ17/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/article/cxGQ17/comments/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/article/NOEXST/comments/UQtEAB`)
    .expect(StatusCodes.NOT_FOUND);
});
