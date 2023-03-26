const authService = require("../service/auth-service");

class AuthController {
	// Login
	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await authService.login(email, password);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 1 * 24 * 60 * 60 * 1000,
				httpOnly: true 
			})
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
	// Logout
	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await authService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}
	// Refresh
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await authService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true 
			})
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new AuthController();