'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const upload = require(`../middlewares/upload`);
const {getAPI} = require(`../api`);

const registerRouter = new Router();
const api = getAPI();

const renderSignUp = (req, res, meta = {}) => {
  const {user} = req.session;
  const {formData, errors} = meta;

  res.render(`sign-up`, {formData, errors, user});
};

registerRouter.get(`/`, renderSignUp);

registerRouter.post(`/`, upload.single(`avatar`), asyncHandler(async (req, res) => {
  const {body, file} = req;

  const userData = {
    name: body.name,
    surname: body.surname,
    avatar: file ? file.filename : ``,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const meta = {
      errors: err.response.data.message,
      formData: {
        name: userData.name,
        surname: userData.surname,
        avatar: userData.avatar,
        email: userData.email,
      }
    };

    renderSignUp(req, res, meta);
  }
}));

module.exports = registerRouter;
