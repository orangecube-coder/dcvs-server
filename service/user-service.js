const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const roleModel = require("../models/role-model");
const UserDto = require("../dtos/user-dtos");

class UserService {
  // Add User
  async addUser(firstName, lastName, email, password) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Такой пользователь уже существует!`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const role = await roleModel.findOne({ value: "USER" });
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      activationLink,
      roles: [role._id],
    });
    const userDto = new UserDto(user);
    const message = {
      state: "success",
      msg: `Пользователь успешно зарегистрирован`,
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
    const users = await userModel.find({}, "-_id -password -__v").populate({
      path: "roles",
      select: "-_id -__v",
      transform: ({ value }) => value,
    });
    return users;
  }
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
      err: "",
    };
    return { message };
  }
  // Delete Role from User
  async delUserRole(email, role) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
    }
    const roleData = await roleModel.findOne({ value: role });
    if (!roleData) {
      throw ApiError.BadRequest(`Роль ${role} не найдена`);
    }
    if (!user.roles.includes(roleData._id)) {
      throw ApiError.BadRequest(`Такой роли нет`);
    }
		if (user.roles.length <= 1) {
			throw ApiError.BadRequest("Нельзя удалить единственную роль");
		}
    user.roles = user.roles.filter((item) => !item.equals(roleData._id));
    await user.save();
    const message = {
      state: "warning",
      msg: `Роль успешно удалена`,
      err: "",
    };
    return { message };
  }
  // Delete User
  async delUser(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь ${email} не найден!`);
    }
    await user.remove();
    const message = {
      state: "warning",
      msg: `Пользователь успешно удален`,
      err: "",
    };
    return { message };
  }
}

module.exports = new UserService();
