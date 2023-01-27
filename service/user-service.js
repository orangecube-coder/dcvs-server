const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dtos");
const ApiError = require("../exceptions/api-error");

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`);
		}
		const hashPassword = await bcrypt.hash(password, 3); 
		const activationLink = uuid.v4();

		const user = await UserModel.create({ email, password: hashPassword, activationLink });
		//await mailService.sendActivationMail(user, `${process.env.API_URL}/api/activate/${activationLink}`);

		const userDto = new UserDto(user); 
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto };
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink})
		if (!user) {
			throw ApiError.BadRequest("Не корректная ссылка для активации!");
		}
		user.isActivaed = true;
		await user.save();
	}
}

module.exports = new UserService();