const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");
const ApiError = require("../exceptions/api-error");

class RoleService {
	async addRole(email, role) {
		const user = await userModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
		}
		const roleData = await roleModel.findOne({ value: role });
		if (!roleData) {
			throw ApiError.BadRequest(`Роль ${role} не найдена`);
		}
		user.roles.push(roleData.value);
		await user.save();
		return user;
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