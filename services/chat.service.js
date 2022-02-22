const ChatRoom = require('../models/ChatRoom');
const UserService = require('./user.service');

class ChatService {

	async getAllUsersChat(userId) {

		let chats = await ChatRoom.find({ members: userId })

		const arrayOfChats = await Promise.all(chats.map(async (chat) => {
			try {

				let currentChat = await chat.populate('members')

				const partnersList = currentChat.members.filter(user => user._id.toString() !== userId)

				const unreadMessages = currentChat.messages.filter(message => message.status !== 'read' && message.senderId !== userId)

				return {
					chatId: currentChat._id,
					user: {
						_id: partnersList[0]._id,
						nickname: partnersList[0].nickname,
						avatar: UserService.base64BufferToBlob(partnersList[0].avatar, 'data:image/jpeg;base64,'),
						online: Boolean(partnersList[0].socketId),
					},
					lastMessage: currentChat.messages.length > 0 ? currentChat.messages[currentChat.messages.length - 1] : null,
					unreadMessages: unreadMessages.length
				}

			} catch (err) {
				console.log(err)
			}
		}))

		const copyOfArray = arrayOfChats.map(a => a)
		copyOfArray.sort((firstElem, secondElem) => {
			if (!secondElem.lastMessage || !firstElem.lastMessage) return false
			return secondElem.lastMessage.createdAt - firstElem.lastMessage.createdAt
		})

		return copyOfArray
	}


	async getInitialChatMessages(chatId) {

		let messages = []
		const numberOfCut = 40

		const chat = await ChatRoom.findById(chatId)
		const messagesList = chat.messages

		for (let i = messagesList.length - 1; i >= messagesList.length - numberOfCut; i--) {
			if (messagesList[i]) {
				const imagesList = messagesList[i].images.length > 0 ? messagesList[i].images.map(image => (UserService.base64BufferToBlob(image, 'data:image/jpeg;base64,'))) : []
				const voiceMessage = messagesList[i].voiceMessage ? UserService.base64BufferToBlob(messagesList[i].voiceMessage, 'data:audio/webm;codecs=opus;base64,') : null
				const message = {
					...messagesList[i],
					images: imagesList,
					voiceMessage
				}
				messages = [message, ...messages]
			} else break
		}
		return {
			chatId: chat._id,
			messages: messages,
		}

	}


	async getChatMessages(chatId, messageId) {

		let messages = []
		const numberOfCut = 40

		const chat = await ChatRoom.findById(chatId)
		const messagesList = chat.messages

		if (messageId === messagesList[0].messageId) {
			return {
				chatId: chat._id,
				messages: messages,
			}
		}

		let counterOfCut = 0

		for (let i = messagesList.length - 1; i >= 0; i--) {
			if (messagesList[i].messageId === messageId) {
				for (let j = i - 1; counterOfCut < numberOfCut; j--) {
					if (messagesList[j]) {
						const imagesList = messagesList[j].images.length > 0 ? messagesList[j].images.map(image => (UserService.base64BufferToBlob(image, 'data:image/jpeg;base64,'))) : []
						const voiceMessage = messagesList[j].voiceMessage ? UserService.base64BufferToBlob(messagesList[j].voiceMessage, 'data:audio/webm;codecs=opus;base64,') : null
						const message = {
							...messagesList[j],
							images: imagesList,
							voiceMessage
						}
						messages = [message, ...messages]
						//messages.push(messagesList[j])
						counterOfCut++
					} else break
				}
			}
		}

		return {
			chatId: chat._id,
			messages: messages,
		}

	}

	async getChatInfo(userId, chatId) {

		let chat = await ChatRoom.findById(chatId)

		chat = await chat.populate('members')

		const partnersList = chat.members.filter(user => user._id.toString() !== userId)

		return {
			chatId: chat._id,
			user: {
				_id: partnersList[0]._id,
				nickname: partnersList[0].nickname,
				avatar: UserService.base64BufferToBlob(partnersList[0].avatar, 'data:image/jpeg;base64,'),
				online: Boolean(partnersList[0].socketId),
			},
		}

	}

}


module.exports = new ChatService()