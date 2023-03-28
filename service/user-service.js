const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const roleModel = require("../models/role-model");
const UserDto = require("../dtos/user-dtos");

class UserService {
	// Registration
	async registration(firstName, lastName, email, password) {
		const candidate = await userModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest(`Пользователь с таким адресом уже существует!`);
		}
		const hashPassword = await bcrypt.hash(password, 3); 
		const activationLink = uuid.v4();
		const role = await roleModel.findOne({ value: 'USER' });
		const user = await userModel.create({
			firstName, 
			lastName, 
			email, 
			password: hashPassword, 
			activationLink, 
			roles: [role._id] 
		});
		const userDto = new UserDto(user);
		const message = {
			state: "success",
			msg: `Пользователь успешно зарегистрирован`,
			err: ""
		}
		// try {
		// 	await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
		// } catch (err) {
		// 	message.state = "warning";
		// 	message.msg = message.msg + ", но с ошибкой!";
		// 	message.err = err;
		// }
		return { message, user: userDto };
	}
	// Get Users
	async getAllUsers() {
		const users = await userModel
			.find({}, "-_id -password -__v")
			.populate({ 
				path: 'roles', 
				select: '-_id -__v', 
				transform: ({ value })  => value
			});
		return users;
	}
}

module.exports = new UserService();