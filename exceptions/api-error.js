module.exports = class ApiError extends Error {
	status
	errors

	constructor(status, message, errors = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static UnauthorizedError(message = 'Пользователь не авторизован') {
		return new ApiError(401, message)
	}

	static PermissionDenied(message = 'Недостаточно прав') {
		return new ApiError(403, message)
	}

	static BadRequest(message, errors = []) {
		return new ApiError(400, message, errors)
	}

	static NotFound(message = 'Ресурс не найден') {
		return new ApiError(404, message)
	}

	static MailerError(message, errors = []) {
		return new ApiError(405, message, errors)
	}

	static InternalError(message = 'Внутренняя ошибка сервера') {
		return new ApiError(500, message)
	}

	static ValidationError(errors = []) {
		return new ApiError(422, 'Ошибка валидации', errors)
	}
}
