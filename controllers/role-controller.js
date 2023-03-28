const roleService = require("../service/role-service");

class RoleController {
	// Get all roles
	async getAllRoles(req, res, next) {
		try {
			const roles = await roleService.getAllRoles();
			return res.json(roles);
		} catch(e) {
			next(e);
		}
	}
}
module.exports = new RoleController();