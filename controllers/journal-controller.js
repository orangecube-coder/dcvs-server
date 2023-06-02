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

	async addNode(req, res, next) {
		try {
			const { nodeName, area } = req.body;
			const nodeData = await journalService.addNode(
        nodeName, area
      );
      return res.json(nodeData);
    } catch (e) {
      next(e);
    }
	}

	async addArea(req, res, next) {
		try {
			const { areaName, areaDescription } = req.body;
			const areaData = await journalService.addArea(
        areaName, areaDescription
      );
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
			const { area } = req.body;
      const areaEditResult = await journalService.editArea(area);
      return res.json(areaEditResult);
		} catch (e) {
			next(e);
		}
	}

}

module.exports = new JournalController();