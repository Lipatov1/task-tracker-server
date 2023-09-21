import { protect } from '../middleware/auth.middleware.js'
import {
	createNewTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask
} from './task.controller.js'
import express from 'express'

const router = express.Router()

router.route('/').post(protect, createNewTask).get(protect, getTasks)

router
	.route('/:id')
	.get(protect, getTask)
	.put(protect, updateTask)
	.delete(protect, deleteTask)

export default router
