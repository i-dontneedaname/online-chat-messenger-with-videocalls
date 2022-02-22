const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserService = require('../services/user.service')
const AuthService = require('../services/auth.service')
const authMiddleware = require('../middleware/auth.middleware')







// /api/auth/register
router.post(
	'/register',
	[
		check('email', 'Invalid email').isEmail(),
		check('password', 'The minimum password length is 7 characters').isLength({ min: 7 })
	],
	async (req, res) => {
		try {

			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({ message: errors.errors[0].msg })
			}

			const { email, password, nickname, avatar } = req.body

			const candidate = await User.findOne({ email })

			if (candidate) {
				return res.status(400).json({ message: 'The user already exists' })
			}

			const hashedPassword = await bcrypt.hash(password, 8)


			let buffer = null
			if (avatar) {
				buffer = UserService.blobToBase64Buffer(avatar)
			}

			const user = await new User({
				email,
				password: hashedPassword,
				nickname,
				avatar: buffer,
				socketId: null
			})

			//console.log(base64BufferToBlob(user.avatar))

			await user.save()

			const tokens = AuthService.generateTokens({ userId: user.id, email })
			await AuthService.saveToken(user.id, tokens.refreshToken)

			// return tokens !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//res.cookie('refreshToken', tokens.refreshToken, { domain: 'localhost', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			res.cookie('refreshToken', tokens.refreshToken, { domain: 'online-chat-messenger', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			res.status(201).json({ ...tokens, _id: user._id, email: user.email, nickname: user.nickname, avatar: avatar })

		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
			console.log(e)
		}
	}
)

// /api/auth/login
router.post(
	'/login',
	[
		check('email', 'Invalid email').isEmail(),
		check('password', 'The minimum password length is 7 characters').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({ message: errors.errors[0].msg })
			}

			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: 'The user was not found' })
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid password' })
			}

			const tokens = AuthService.generateTokens({ userId: user.id, email })
			await AuthService.saveToken(user.id, tokens.refreshToken)

			// return tokens !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//res.cookie('refreshToken', tokens.refreshToken, { domain: 'localhost', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			res.cookie('refreshToken', tokens.refreshToken, { domain: 'online-chat-messenger', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			res.status(201).json({ ...tokens, _id: user._id, email: user.email, nickname: user.nickname, avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,') })

		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
			console.log(e)
		}
	}
)


// /api/auth/logout
router.post(
	'/logout',
	async (req, res) => {
		try {

			const { refreshToken } = req.cookies;
			await AuthService.removeToken(refreshToken)
			res.clearCookie('refreshToken');
			res.status(200).json({ message: "You are logged out" });

		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
		}
	}
)



// /api/auth/refresh
router.get(
	'/refresh',
	async (req, res) => {
		try {

			const { refreshToken } = req.cookies;

			const userData = jwt.verify(refreshToken, config.get('refreshJWT'));

			const tokenFromDb = await Token.findOne({ refreshToken });

			if (!userData || !tokenFromDb) {
				return res.status(401).json({ message: "Session done" })
			}

			const user = await User.findById(userData.userId);


			const tokens = AuthService.generateTokens({ userId: user.id, email: user.email });
			await AuthService.saveToken(user.id, tokens.refreshToken);

			//// return tokens !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//res.cookie('refreshToken', tokens.refreshToken, { domain: 'localhost', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			res.cookie('refreshToken', tokens.refreshToken, { domain: 'online-chat-messenger', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
			//res.status(201).json({ ...tokens, email: user.email, nickname: user.nickname})
			res.status(201).json({ ...tokens, _id: user._id, email: user.email, nickname: user.nickname, avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,') })

		} catch (e) {
			res.status(401).json({ message: "Session done" })
		}
	}
)



// /api/auth/settings
router.post(
	'/settings',
	[
		authMiddleware
	],
	async (req, res) => {
		try {

			const { settings } = req.body
			const { userId } = req.user

			console.log(settings)

			const newSettings = {}

			for (let key in settings) {
				if (key === 'avatar') {
					newSettings[key] = settings['avatar'] ? UserService.blobToBase64Buffer(settings[key]) : null
				} else {
					newSettings[key] = settings[key]
				}
			}


			const user = await User.findByIdAndUpdate(userId, { ...newSettings }, { new: true })

			res.status(200).json({ email: user.email, nickname: user.nickname, avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,') })

		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
		}
	}
)




module.exports = router;