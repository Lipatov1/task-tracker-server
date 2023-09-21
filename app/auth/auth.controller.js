import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.utils.js'
import { generateToken } from './generate-token.js'
import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

// @desc    Auth user
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (!user) {
		res.status(400)
		throw new Error('Пользователь с таким Email не найден')
	}

	const isValidPassword = await verify(user.password, password)

	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email или пароль введен неверно')
	}
})

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('Пользователь с таким Email уже существует')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password)
		},
		select: UserFields
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
