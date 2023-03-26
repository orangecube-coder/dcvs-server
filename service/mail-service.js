const nodemailer = require('nodemailer');

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			}
		})
	}
	// Send Link
	async sendActivationMail(to, link) {
		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to,
				subject: 'Активация на ' + process.env.API_URL,
				text: '',
				html: `<div><h1>Пройдите по ссылке</h1><a href="${link}">${link}</a></div>`
			})
		} catch(err) {
			throw err;
		}
	}
	// Activate
	async activate(activationLink) {
		const user = await userModel.findOne({ activationLink})
		if (!user) {
			throw ApiError.BadRequest("Не корректная ссылка для активации!");
		}
		user.isActivaed = true;
		await user.save();
	}
}

module.exports = new MailService();