const mailService = require("../service/mail-service");

class MailController {
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await mailService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}
}
module.exports = new MailController();