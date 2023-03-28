const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");
const ApiError = require("../exceptions/api-error");
const UserDto = require("../dtos/user-dtos");

class RoleService {
  async getAllRoles() {
    const roles = await roleModel.find();
    return roles;
  }
  async getRolesByEmail(email) {
    const { roles } = await userModel
      .findOne({ email })
      .populate({ path: "roles", select: "-_id -__v" });
    if (!roles) {
      throw ApiError.BadRequest(`Что-то пошло не так`);
    }
    return roles.flatMap(({ value }) => value);
  }
}
module.exports = new RoleService();
