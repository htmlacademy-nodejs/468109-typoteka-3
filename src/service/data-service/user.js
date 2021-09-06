'use strict';

class UserService {
  constructor(orm) {
    this._User = orm.models.User;
  }

  async create(userData) {
    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user && user.get();
  }
}

module.exports = UserService;
