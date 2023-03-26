const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dtos");

class AuthService {
	// Login
	async login(email, password) {
		const user = await userModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest("Неверный пароль!");
		}
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto };
	}
	// Logout
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}
	// Refresh
	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}
		const user = await userModel.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, ...user };
	}
}

module.exports = new AuthService();