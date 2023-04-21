const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");
const ApiError = require("../exceptions/api-error");

class RoleService {
  async getAllRoles() {
    const roles = await roleModel.find();
    return roles;
  }
  async getRolesByEmail(email) {
    const { roles } = await userModel
      .findOne({ email })
      .populate({
        path: "roles",
        select: "-_id -__v",
        transform: ({ value }) => value,
      });
    if (!roles) {
      throw ApiError.BadRequest(`Что-то пошло не так`);
    }
    return roles;
  }
}
module.exports = new RoleService();
