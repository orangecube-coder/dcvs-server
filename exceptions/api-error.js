module.exports = class ApiError extends Error {
	state;
	errors;

	constructor(state, message, errors = []) {
		super(message);
		this.state = state;
		this.errors = errors;
	}

	static UnauthorizedError() {
		return new ApiError(401, 'Пользователь не авторизован');
	}

	static PermissionDenied() {
		return new ApiError(403, 'Недостаточно прав');
	}

	static BadRequest(message, errors = []) {
		return new ApiError(400, message, errors);
	}

	static MailerError(message, errors = []) {
		return new ApiError(405, message, errors);
	}

}