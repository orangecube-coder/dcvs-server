const roleService = require("../service/role-service");

class RoleController {
	// Add role to user
	async addRole(req, res, next) {
		try {
			const { email, role } = req.body;
			const roles = await roleService.getAllRoles();	
			const roleResult = await roleService.addRole(email, role);
			return res.json({ role });
		} catch (e) {
			next(e);
		}
	}
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