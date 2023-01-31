const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dtos");
const ApiError = require("../exceptions/api-error");
const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");

class UserService {
	async registration(email, password) {
		const candidate = await userModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`);
		}
		const hashPassword = await bcrypt.hash(password, 3); 
		const activationLink = uuid.v4();
		const role = await roleModel.findOne({ value: 'USER' });
		const user = await userModel.create({ email, password: hashPassword, activationLink, roles: [role.value] });
		await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

		const userDto = new UserDto(user); 
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto };
	}
	async activate(activationLink) {
		const user = await userModel.findOne({ activationLink})
		if (!user) {
			throw ApiError.BadRequest("Не корректная ссылка для активации!");
		}
		user.isActivaed = true;
		await user.save();
	}
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
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}
	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}
		const user = userModel.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto };
	}
	async getAllUsers() {
		const users = userModel.find();
		return users;
	}
	async addRole(email, role) {
		const user = await userModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
		}
		user.roles.push(role);
		await user.save();
		return user;
	}
}

module.exports = new UserService();