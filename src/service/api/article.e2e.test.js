'use strict';
/* eslint max-nested-callbacks: "off" */

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

const invalidId = `NOEXST`;

describe(`GET list of articles`, () => {
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
});

describe(`GET an article`, () => {
  const updatedArticleId = mockArticles[0].id;
  const updatedArticleTitle = mockArticles[0].title;

  describe(`API returns an article with given id`, () => {
    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/article/${updatedArticleId}`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

    test(`Articles's title is "Как начать программировать"`, () => expect(response.body.title).toBe(updatedArticleTitle));
  });
});

describe(`POST an article`, () => {
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
});

describe(`PUT an article`, () => {
  const updatedArticleId = mockArticles[0].id;

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
        .put(`/article/${updatedArticleId}`)
        .send(newArticle);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

    test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

    test(`Article is really changed`, () => request(app)
      .get(`/article/${updatedArticleId}`)
      .expect((res) => expect(res.body.title).toBe(newArticle.title))
    );
  });

  test(`API returns status code 404 when trying to change non-existent article`, async () => {
    const app = await createAPI();

    const validArticle = {
      category: `Котики`,
      title: `Дам погладить котика`,
      fullText: `Дам погладить котика. Дорого. Не гербалайф`,
      announce: `Гладим котиков`,
      createdDate: 1621239403082
    };

    return request(app)
      .put(`/article/${invalidId}`)
      .send(validArticle)
      .expect(StatusCodes.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
    const app = await createAPI();

    const invalidArticle = {
      category: `Это`,
      title: `невалидный`,
      fullText: `объект`,
      announce: `нет поля createdDate`,
    };

    return request(app)
      .put(`/article/${updatedArticleId}`)
      .send(invalidArticle)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(`DELETE an article`, () => {
  const deletedArticleId = mockArticles[0].id;

  describe(`API correctly deletes an article`, () => {
    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/article/${deletedArticleId}`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

    test(`Returns deleted article`, () => expect(response.body.id).toBe(deletedArticleId));

    test(`Article count is 4 now`, () => request(app)
      .get(`/article`)
      .expect((res) => expect(res.body.length).toBe(4))
    );
  });

  test(`API refuses to delete non-existent article`, async () => {
    const app = await createAPI();

    return request(app)
      .delete(`/article/${invalidId}`)
      .expect(StatusCodes.NOT_FOUND);
  });
});

describe(`POST an article comment`, () => {
  const updatedArticleId = mockArticles[0].id;

  test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
    const app = await createAPI();

    return request(app)
      .post(`/article/${invalidId}/comments`)
      .send({
        text: `Неважно`
      })
      .expect(StatusCodes.NOT_FOUND);
  });

  test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
    const app = await createAPI();

    return request(app)
      .post(`/article/${updatedArticleId}/comments`)
      .send({})
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(`DELETE an article comment`, () => {
  const updatedArticleId = mockArticles[0].id;
  const deletedCommentId = mockArticles[0].comments[1].id;

  test(`API refuses to delete non-existent article`, async () => {
    const app = await createAPI();

    return request(app)
      .delete(`/article/${updatedArticleId}/comments/${invalidId}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  describe(`API correctly deletes a comment`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/article/${updatedArticleId}/comments/${deletedCommentId}`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

    test(`Comments count is 3 now`, () => request(app)
      .get(`/article/${updatedArticleId}/comments`)
      .expect((res) => expect(res.body.length).toBe(3))
    );
  });

  test(`API refuses to delete non-existent comment`, async () => {
    const app = await createAPI();

    return request(app)
      .delete(`/article/${updatedArticleId}/comments/${invalidId}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  test(`API refuses to delete a comment to non-existent article`, async () => {
    const app = await createAPI();

    return request(app)
      .delete(`/article/${invalidId}/comments/${deletedCommentId}`)
      .expect(StatusCodes.NOT_FOUND);
  });
});
