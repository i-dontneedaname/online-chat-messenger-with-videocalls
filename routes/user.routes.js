const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware')
const UserService = require('../services/user.service')


// /api/user/getusers
router.get(
	'/getusers',
	[
		authMiddleware
	],
	async (req, res) => {

		try {

			const { nickname, online } = req.query


			if (online) {
				const onlineUserList = (await User.find({ socketId: { $ne: null } }))
					.map(user => ({
						_id: user._id,
						nickname: user.nickname,
						avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,'),
						online: Boolean(user.socketId)
					}))

				return res.status(200).json({ onlineUserList })
			}


			if (nickname) {
				// Заполняю массив юзерами
				const userList = (await User.find({ nickname: { "$regex": nickname, "$options": "i" } }))
					.map(user => ({
						_id: user._id,
						nickname: user.nickname,
						avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,'),
						online: Boolean(user.socketId)
					}))


				return res.status(200).json({ userList })
			}


		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
		}

	}
)


module.exports = router;