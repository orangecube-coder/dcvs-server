const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function(roles) {
	return function(req, res, next) {
		try {
			const authorizationHeader = req.headers.authorization;
			if (!authorizationHeader) {
				return next(ApiError.UnauthorizedError());
			}
			const accessToken = authorizationHeader.split(' ')[1];
			if (!accessToken) {
				return next(ApiError.UnauthorizedError());
			}
			userData = tokenService.validateAccessToken(accessToken);
			if (!userData) {
				return next(ApiError.UnauthorizedError());
			}
			let hasRole = false;
			userData.roles.forEach(role => {
				if (roles.includes(role)) { hasRole = true; }
			});
			if (!hasRole) {
				return next(ApiError.UnauthorizedError());
			}
			req.user = userData;
			next();
		} catch (e) {
			return next(ApiError.UnauthorizedError());
		}
	}
}