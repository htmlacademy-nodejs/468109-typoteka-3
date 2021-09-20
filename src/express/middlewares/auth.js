'use strict';

module.exports = (onlyForAdmin) => (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  console.log('user', user);

  if (onlyForAdmin && !user.isAdmin) {
    return res.redirect(`/404`);
  }

  return next();
};
