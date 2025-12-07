const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')
const roleService = require('../service/role-service')
const userModel = require('../models/user-model')
const roleModel = require('../models/role-model')

module.exports = function (roles) {
	return async function (req, res, next) {
		try {
			const authorizationHeader = req.headers.authorization
			if (!authorizationHeader) {
				return next(ApiError.UnauthorizedError())
			}
			const accessToken = authorizationHeader.split(' ')[1]
			if (!accessToken) {
				return next(ApiError.UnauthorizedError('Access token is missing'))
			}
			const userData = tokenService.validateAccessToken(accessToken)
			if (!userData) {
				return next(ApiError.UnauthorizedError('UserData is missing'))
			}
			let hasRole = false
			const userRoles = await roleService.getRolesByEmail(userData.email)
			userRoles.forEach(role => {
				if (roles.includes(role)) {
					hasRole = true
				}
			})
			if (!hasRole) {
				return next(ApiError.PermissionDenied('Недостаточно прав'))
			}
			req.user = userData
			next()
		} catch (e) {
			console.log(e)
			return next(ApiError.UnauthorizedError('Error from the catch block'))
		}
	}
}
