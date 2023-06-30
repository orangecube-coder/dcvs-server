const journalService = require("../service/journal-service");

class JournalController {
  async getAllNodes(req, res, next) {
    try {
      const nodes = await journalService.getAllNodes();
      return res.json(nodes);
    } catch (e) {
      next(e);
    }
  }

  async getAllAreas(req, res, next) {
    try {
      const areas = await journalService.getAllAreas();
      return res.json(areas);
    } catch (e) {
      next(e);
    }
  }

  async getAllJournalItems(req, res, next) {
    try {
      const journalItems = await journalService.getAllJournalItems();
      return res.json(journalItems);
    } catch (e) {
      next(e);
    }
  }

  async addJournalItem(req, res, next) {
    try {
      const { node, user, timestamp, description } = req.body;
			console.log(user);
      const itemData = await journalService.addJournalItem(
        node,
        user,
        timestamp,
        description
      );
      return res.json(itemData);
    } catch (e) {
      next(e);
    }
  }

  async addNode(req, res, next) {
    try {
      const { value, area } = req.body;
      const nodeData = await journalService.addNode(value, area);
      return res.json(nodeData);
    } catch (e) {
      next(e);
    }
  }

  async addArea(req, res, next) {
    try {
      const { value, description } = req.body;
      const areaData = await journalService.addArea(value, description);
      return res.json(areaData);
    } catch (e) {
      next(e);
    }
  }

  async delNode(req, res, next) {
    try {
      const { node } = req.body;
      const nodeDelResult = await journalService.delNode(node);
      return res.json(nodeDelResult);
    } catch (e) {
      next(e);
    }
  }

  async delArea(req, res, next) {
    try {
      const { area } = req.body;
      const areaDelResult = await journalService.delArea(area);
      return res.json(areaDelResult);
    } catch (e) {
      next(e);
    }
  }

  async editArea(req, res, next) {
    try {
      const { area, value, description } = req.body;
      const areaEditResult = await journalService.editArea(
        area,
        value,
        description
      );
      return res.json(areaEditResult);
    } catch (e) {
      next(e);
    }
  }

  async editNode(req, res, next) {
    try {
      const { node, value, area } = req.body;
      const nodeEditResult = await journalService.editNode(node, value, area);
      return res.json(nodeEditResult);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new JournalController();
