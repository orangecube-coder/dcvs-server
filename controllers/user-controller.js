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
      const { firstName, lastName, email, password } = req.body;
      const userData = await userService.addUser(
        firstName,
        lastName,
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
      const { email, role } = req.body;
      const roleResult = await userService.addUserRole(email, role);
      return res.json(roleResult);
    } catch (e) {
      next(e);
    }
  }
  // Delete role from User
  async delUserRole(req, res, next) {
    try {
      const { email, role } = req.body;
      const roleDelResult = await userService.delUserRole(email, role);
      return res.json(roleDelResult);
    } catch (e) {
      next(e);
    }
  }
  // Delete User
  async delUser(req, res, next) {
    try {
      const { email } = req.body;
      const userDelResult = await userService.delUser(email);
      return res.json(userDelResult);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
