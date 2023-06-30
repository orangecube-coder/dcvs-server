const nodeModel = require("../models/node-model");
const areaModel = require("../models/area-model");
const ApiError = require("../exceptions/api-error");
const journalModel = require("../models/journal-model");
const userModel = require("../models/user-model");

class JournalService {
  async getAllNodes() {
    const nodes = await nodeModel.find({}, "-__v").populate({
      path: "area",
      select: "-__v",
    });
    return nodes;
  }

  async getAllAreas() {
    const areas = await areaModel.find({}, "-__v");
    return areas;
  }

  async getAllJournalItems() {
    const journalItems = await journalModel
      .find({}, "-__v")
      .populate({
        path: "node",
        select: "-__v",
				populate: {
          path: "area",
          select: "-__v",
        },
      })
      .populate({
        path: "user",
        select: "-__v",
      });
    return journalItems;
  }

  async addNode(value, area) {
    const candidate = await nodeModel.findOne({ value });
    if (candidate) {
      throw ApiError.BadRequest(`Такой узел уже существует!`);
    }
    const areaData = await areaModel.findOne({ _id: area._id });
    if (!areaData) {
      throw ApiError.BadRequest(`Зона ${area.value} не найдена`);
    }
    const node = await nodeModel.create({
      value,
      area: areaData._id,
    });
    const message = {
      state: "success",
      msg: `Узел успешно зарегистрирован`,
      err: "",
    };
    return { message };
  }

  async addJournalItem(node, user, timestamp, description) {
    const nodeData = await nodeModel.findOne({ _id: node._id });
    if (!nodeData) {
      throw ApiError.BadRequest(`Узел ${node.value} не найден`);
    }
    const userData = await userModel.findOne({ _id: user._id });
    console.log(user._id);
    if (!userData) {
      throw ApiError.BadRequest(`Пользователь ${user.name} не найден`);
    }
    const item = await journalModel.create({
      node: node._id,
      user: user._id,
      timestamp,
      description,
    });
    const message = {
      state: "success",
      msg: `Запись успешно создана`,
      err: "",
    };
    return { message };
  }

  async addArea(value, description) {
    const candidate = await areaModel.findOne({ value });
    if (candidate) {
      throw ApiError.BadRequest(`Такая зона уже существует!`);
    }
    const area = await areaModel.create({ value, description });
    const message = {
      state: "success",
      msg: `Зона успешно зарегистрирована`,
      err: "",
    };
    return { message };
  }

  // async addJournalItem(node, timestamp, description) {
  //   const journalItem = await journalModel.create({ node: node._id, timestamp, description });
  //   const message = {
  //     state: "success",
  //     msg: `Запись успешно зарегистрирована`,
  //     err: "",
  //   };
  //   return { message };
  // }

  async delNode(node) {
    const nodeData = await nodeModel.findOne({ _id: node._id });
    if (!nodeData) {
      throw ApiError.BadRequest(`Узел ${node.value} не найден!`);
    }
    await nodeData.remove();
    const message = {
      state: "warning",
      msg: `Узел успешно удален`,
      err: "",
    };
    return { message };
  }

  async delArea(area) {
    const areaData = await areaModel.findOne({ _id: area._id });
    if (!areaData) {
      throw ApiError.BadRequest(`Зона ${area.value} не найдена!`);
    }
    const nodeCount = await nodeModel.countDocuments({ area: area._id });
    if (nodeCount > 0) {
      throw ApiError.BadRequest(`Нельзя удалить зону содержащую узлы!`);
    }
    await areaData.remove();
    const message = {
      state: "warning",
      msg: `Зона успешно удалена`,
      err: "",
    };
    return { message };
  }

  async editArea(area, value, description) {
    const areaData = await areaModel.findOne({ _id: area._id });
    if (!areaData) {
      throw ApiError.BadRequest(`Зона ${area.value} не найдена!`);
    }
    areaData.overwrite({ value, description });
    await areaData.save();
    const message = {
      state: "success",
      msg: `Зона успешно обновлена`,
      err: "",
    };
    return { message };
  }

  async editNode(node, value, area) {
    const nodeData = await nodeModel.findOne({ _id: node._id });
    if (!nodeData) {
      throw ApiError.BadRequest(`Узел ${node.value} не найден!`);
    }
    nodeData.overwrite({ value, area });
    await nodeData.save();
    const message = {
      state: "success",
      msg: `Узел успешно обновлён`,
      err: "",
    };
    return { message };
  }
}

module.exports = new JournalService();
