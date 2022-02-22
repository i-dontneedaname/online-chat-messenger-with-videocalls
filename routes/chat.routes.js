const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middleware/auth.middleware')
const ChatService = require('../services/chat.service')




// /api/chats/getalluserschats
router.get(
	'/getalluserschats',
	[
		authMiddleware
	],
	async (req, res, next) => {

		try {

			const { userId } = req.user

			const chats = await ChatService.getAllUsersChat(userId)

			res.status(200).json({ chats })

		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
			console.log(e)
		}

	}
)


// /api/chats/getchatmessages/:chatId
router.get(
	'/chat/:chatId',
	[
		authMiddleware
	],
	async (req, res) => {
		try {

			const { chatId } = req.params
			const { userId } = req.user
			const { messages, userInfo, messageId } = req.query
			

			if (messages && userInfo && !messageId) {
				const chatInfo = await ChatService.getChatInfo(userId, chatId)
				const chatMessages = await ChatService.getInitialChatMessages(chatId)
				return res.status(200).json({ chatInfo, chatMessages })
			}

			if (messages && messageId) {
				const chatMessages = await ChatService.getChatMessages(chatId, messageId)
				return res.status(200).json({ chatMessages })
			}


		} catch (e) {
			res.status(500).json({ message: "Something went wrong, try again" })
			console.log(e)
		}

	}
)


module.exports = router;