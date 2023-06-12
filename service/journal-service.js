const nodeModel = require("../models/node-model");
const areaModel = require("../models/area-model");
const ApiError = require("../exceptions/api-error");

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

  async addNode(nodeName, area) {
    const areaData = await areaModel.findOne({ _id: area._id });
    if (!areaData) {
      throw ApiError.BadRequest(`Зона ${area.value} не найдена`);
    }
    const node = await nodeModel.create({
      value: nodeName,
      area: areaData._id,
    });
    const message = {
      state: "success",
      msg: `Узел успешно зарегистрирован`,
      err: "",
    };
    return { message };
  }

  async addArea(areaName, areaDescription) {
    const area = await areaModel.create({
      value: areaName,
      description: areaDescription,
    });
    const message = {
      state: "success",
      msg: `Зона успешно зарегистрирована`,
      err: "",
    };
    return { message };
  }

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
