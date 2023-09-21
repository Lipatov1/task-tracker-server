import { prisma } from '../prisma.js'
import asyncHandler from 'express-async-handler'

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
	const tasks = await prisma.task.findMany({
		where: {
			userId: +req.user.id
		}
	})

	res.json(tasks)
})

// @desc    Get task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
	const task = await prisma.task.findUnique({
		where: { id: +req.params.id }
	})

	if (!task) {
		res.status(404)
		throw new Error('Задача не найдена')
	}

	res.json({ ...task })
})

// @desc    Create new task
// @route 	POST /api/tasks
// @access  Private
export const createNewTask = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		status,
		priority,
		date,
		plannedTime,
		elapsedTime
	} = req.body

	const task = await prisma.task.create({
		data: {
			name,
			description,
			status,
			priority,
			date,
			plannedTime,
			elapsedTime,
			user: {
				connect: {
					id: req.user.id
				}
			}
		}
	})

	res.json(task)
})

// @desc    Update task
// @route 	PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		status,
		priority,
		date,
		plannedTime,
		elapsedTime
	} = req.body

	try {
		const task = await prisma.task.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				description,
				status,
				priority,
				date,
				plannedTime,
				elapsedTime
			}
		})

		res.json(task)
	} catch (error) {
		res.status(404)
		throw new Error('Задача не найдена')
	}
})

// @desc    Delete task
// @route 	DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
	try {
		const task = await prisma.task.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Задача не удалена' })
	} catch (error) {
		res.status(404)
		throw new Error('Задача не найдена')
	}
})
