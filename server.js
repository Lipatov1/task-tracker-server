import authRoutes from './app/auth/auth.routes.js'
import { errorHandler, notFound } from './app/middleware/error.middleware.js'
import { prisma } from './app/prisma.js'
import workoutRoutes from './app/task/task.routes.js'
import userRoutes from './app/user/user.routes.js'
import 'colors'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'))
	}

	app.use(cors())
	app.use(express.json())

	const __dirname = path.resolve()

	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)
	app.use('/api/tasks', workoutRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = 5001

	app.listen(
		PORT,
		console.log(
			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
