'use strict';

const express = require(`express`);
const path = require(`path`);
const session = require(`express-session`);

const mainRoutes = require(`./routes/main-routes`);
const registerRoutes = require(`./routes/register-routes`);
const loginRoutes = require(`./routes/login-routes`);
const logoutRoutes = require(`./routes/logout-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const searchRoutes = require(`./routes/search-routes`);
const categoriesRoutes = require(`./routes/categories-routes`);
const getSequelize = require(`../service/lib/sequelize`);

const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const sequelize = getSequelize();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 1000 * 60 * 60,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/register`, registerRoutes);
app.use(`/login`, loginRoutes);
app.use(`/logout`, logoutRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/search`, searchRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT);
