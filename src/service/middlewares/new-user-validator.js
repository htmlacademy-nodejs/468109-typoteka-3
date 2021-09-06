'use strict';

const {StatusCodes} = require(`http-status-codes`);

const userSchema = require(`../schemas/user`);

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;

  try {
    await userSchema.validate(newUser);
    const userByEmail = await service.findByEmail(req.body.email);

    if (userByEmail) {
      return res.status(StatusCodes.BAD_REQUEST)
        .send(`Email is already in use`);
    }
  } catch (err) {
    const {details} = err;

    res.status(StatusCodes.BAD_REQUEST).json({
      message: details.map((errorDescription) => ({
        name: errorDescription.context.label,
        text: errorDescription.message
      }))
    });
  }

  return next();
};
