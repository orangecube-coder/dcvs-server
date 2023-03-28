const userService = require("../service/user-service");
const ApiError = require("../exceptions/api-error");
const { validationResult } = require("express-validator");

class UserController {
	// Registration
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
			}
			const {firstName, lastName, email, password} = req.body;
			const userData = await userService.registration(firstName, lastName, email, password);
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

}

module.exports = new UserController();