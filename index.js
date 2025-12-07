require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middleware/error-middleware')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

mongoose.set('strictQuery', true)

const PORT = process.env.PORT || 5000
const app = express()

app.use(helmet()) // Security headers
app.use(mongoSanitize()) // Защита от NoSQL injection. Удалит $ и . из req.body

// DDOS: Rate limiting для API
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 100, // 100 запросов с одного IP
	message: 'Слишком много запросов с этого IP',
	standardHeaders: true,
	legacyHeaders: false,
})
app.use('/api', apiLimiter)

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
)
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
	try {
		mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
}

start()
