import { protect } from '../middleware/auth.middleware.js'
import { getUserProfile } from './user.controller.js'
import express from 'express'

const router = express.Router()

router.route('/profile').get(protect, getUserProfile)

export default router
