const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const roleModel = require("../models/role-model");
const UserDto = require("../dtos/user-dtos");

class UserService {
  // Add User
  async addUser(name, email, password) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Такой пользователь уже существует!`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const role = await roleModel.findOne({ value: "USER" });
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      activationLink,
      roles: [role._id],
    });
    const userDto = new UserDto(user);
    const message = {
      state: "success",
      msg: `Пользователь добавлен`,
      err: "",
    };
    // try {
    // 	await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    // } catch (err) {
    // 	message.state = "warning";
    // 	message.msg = message.msg + ", но с ошибкой!";
    // 	message.err = err;
    // }
    return { message };
  }
  // Get all Users
  async getAllUsers() {
    const users = await userModel.find({}, "-password -__v").populate({
      path: "roles",
      select: "-__v",
      // transform: ({ value }) => value,
    });
    return users;
  }
  async addUserRole(user, role) {
    const userData = await userModel.findOne({ _id: user._id });
    if (!userData) {
      throw ApiError.BadRequest(`Пользователь ${user.email} не найден!`);
    }
    const roleData = await roleModel.findOne({ _id: role._id });
    if (!roleData) {
      throw ApiError.BadRequest(`Роль ${role.value} не найдена`);
    }
    if (userData.roles.includes(roleData._id)) {
      throw ApiError.BadRequest(`Такая роль уже имеется`);
    }
    userData.roles.push(roleData._id);
    await userData.save();
    const message = {
      state: "success",
      msg: `Роль добавлена`,
      err: "",
    };
    return { message };
  }
  // Delete Role from User
  async delUserRole(user, role) {
    const userData = await userModel.findOne({ _id: user._id });
    if (!userData) {
      throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
    }
    const roleData = await roleModel.findOne({ _id: role._id });
    if (!roleData) {
      throw ApiError.BadRequest(`Роль ${role} не найдена`);
    }
    if (!userData.roles.includes(roleData._id)) {
      throw ApiError.BadRequest(`Такой роли нет`);
    }
		if (userData.roles.length <= 1) {
			throw ApiError.BadRequest("Нельзя удалить единственную роль");
		}
    userData.roles = userData.roles.filter((item) => !item.equals(roleData._id));
    await userData.save();
    const message = {
      state: "warning",
      msg: `Роль удалена`,
      err: "",
    };
    return { message };
  }
  // Delete User
  async delUser(user) {
    const userData = await userModel.findOne({ _id: user._id });
    if (!userData) {
      throw ApiError.BadRequest(`Пользователь ${user.email} не найден!`);
    }
		await userData.update
    await userData.remove();
    const message = {
      state: "warning",
      msg: `Пользователь удален`,
      err: "",
    };
    return { message };
  }
}

module.exports = new UserService();
