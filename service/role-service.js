const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");
const ApiError = require("../exceptions/api-error");
const UserDto = require("../dtos/user-dtos");

class RoleService {
	async addUserRole(email, role) {
		const user = await userModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
		}
		const roleData = await roleModel.findOne({ value: role });
		if (!roleData) {
			throw ApiError.BadRequest(`Роль ${role} не найдена`);
		}
		if (user.roles.includes(roleData._id)) {
			throw ApiError.BadRequest(`Такая роль уже имеется`);
		}
		user.roles.push(roleData._id);
		await user.save();
		const message = {
			state: "success",
			msg: `Роль успешно добавлена`,
			err: ""
		}
		return {message, user: UserDto};
	}
	async getAllRoles() {
		const roles = await roleModel.find();
		return roles;
	}
	async getRolesByEmail(email) {
		const { roles } = await userModel
			.findOne({ email })
			.populate({path: 'roles', select: '-_id -__v'});
		if (!roles) {
			throw ApiError.BadRequest(`Что-то пошло не так`);
		}	
		return roles.flatMap(({ value }) => value);
	}
}
module.exports = new RoleService();