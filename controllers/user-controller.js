const userService = require("../service/user-service");
const ApiError = require("../exceptions/api-error");
const { validationResult } = require("express-validator");

class UserController {
  // Registration
  async addUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { name, email, password } = req.body;
      const userData = await userService.addUser(
        name,
        email,
        password
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  // Get Users
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
  // Add role to User
  async addUserRole(req, res, next) {
    try {
      const { user, role } = req.body;
      const roleResult = await userService.addUserRole(user, role);
      return res.json(roleResult);
    } catch (e) {
      next(e);
    }
  }
  // Delete role from User
  async delUserRole(req, res, next) {
    try {
      const { user, role } = req.body;
      const roleDelResult = await userService.delUserRole(user, role);
      return res.json(roleDelResult);
    } catch (e) {
      next(e);
    }
  }
  // Delete User
  async delUser(req, res, next) {
    try {
      const { user } = req.body;
      const userDelResult = await userService.delUser(user);
      return res.json(userDelResult);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
