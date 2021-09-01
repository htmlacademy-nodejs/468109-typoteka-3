'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const registerRoutes = require(`./routes/register-routes`);
const loginRoutes = require(`./routes/login-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const searchRoutes = require(`./routes/search-routes`);
const categoriesRoutes = require(`./routes/categories-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/register`, registerRoutes);
app.use(`/login`, loginRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/search`, searchRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT);
