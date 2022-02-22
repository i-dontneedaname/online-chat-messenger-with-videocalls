const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const config = require('config');
const jwt = require('jsonwebtoken')
const UserService = require('./services/user.service')


const jwtMiddleware = (socket, next) => {
	try {

		const { token } = socket.handshake.query

		if (!token) {
			return socket.emit('user:notAuthorized', { message: 'User is not authorized' })
		}

		const userData = jwt.verify(token, config.get('accessJWT'))
		socket.data = userData
		next()

	} catch (e) {
		return socket.emit('user:notAuthorized', { message: 'User is not authorized' })
	}

};



module.exports = function (io) {



	io.use(jwtMiddleware);

	io.on('connection', async (socket) => {

		console.log('connected')

		socket.on('disconnect', async () => {
			// Изменяю поле socketId пользователю, который дисконнектнулся
			const { userId } = socket.data
			const user = await User.findByIdAndUpdate(userId, { socketId: null }, { new: true })
			// Отправляю всем онлайн юзерам дисконнект. юзера 
			socket.broadcast.emit('user:changeUserStatus', {
				_id: user._id,
				online: Boolean(user.socketId)
			})
			console.log('disconnected')
		})


		socket.on('user:setSocketId', async () => {
			try {

				// Изменяю поле socketId пользователю, который законнектился
				const { userId } = socket.data
				const user = await User.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true })
				// Отправляю всем онлайн юзерам нового законнект. юзера 
				socket.broadcast.emit('user:changeUserStatus', {
					_id: user._id,
					nickname: user.nickname,
					avatar: UserService.base64BufferToBlob(user.avatar, 'data:image/jpeg;base64,'),
					online: Boolean(user.socketId)
				})

			} catch (e) {

			}

		})


		socket.on('chatRoom:createChat', async ({ partnerId }) => {
			// -----------------------------------------------------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			try {
				// Проверяем в БД есть ли уже чат с данным пользователем
				const { userId } = socket.data
				const chatRoomCandidate = await ChatRoom.findOne({ members: { $all: [partnerId, userId] } })
				// Если есть, то передаем данные чата для перехода в него
				if (chatRoomCandidate) {
					return socket.emit('chatRoom:onChatCreate', { chatId: chatRoomCandidate._id, isNew: false })
				}
				// Если нет, то создаем новый чат
				let chatRoom = await new ChatRoom({
					members: [partnerId, userId],
				})

				await chatRoom.save()

				chatRoom = await chatRoom.populate('members')
				const partnersList = chatRoom.members.filter(user => user._id.toString() !== userId)

				// Передаем созданный чат юзеру для создания компонента в СПИСКЕ ВСЕХ ЧАТОВ юзера
				// И для перехода в созданный чат
				socket.emit('chatRoom:onChatCreate', {
					chatId: chatRoom._id,
					user: {
						_id: partnersList[0]._id,
						nickname: partnersList[0].nickname,
						avatar: UserService.base64BufferToBlob(partnersList[0].avatar, 'data:image/jpeg;base64,'),
						online: Boolean(partnersList[0].socketId),
					},
					lastMessage: null,
					unreadMessages: null,
					isNew: true
				})

			} catch (e) {
				console.log(e)
			}

		})
		

		socket.on('chatRoom:sendMessage', async ({ newMessage, chatId }) => {
			try {
				// data:audio/webm;codecs=opus;base64,
				socket.emit('chatRoom:newMessage', {
					newMessage,
					messageFrom: chatId
				})
				// Добавляем новое сообщение со статусом "Отправлено" в БД чата
				const { userId } = socket.data
				const voiceMessage = newMessage.voiceMessage ? UserService.blobToBase64Buffer(newMessage.voiceMessage) : null
				const imagesList = newMessage.images.length > 0 ? newMessage.images.map(image => (UserService.blobToBase64Buffer(image))) : []
				let chatRoom = await ChatRoom.findByIdAndUpdate(chatId, { $push: { messages: { ...newMessage, images: imagesList, voiceMessage: voiceMessage, status: 'sent' } } }, { new: true })

				chatRoom = await chatRoom.populate('members')
				const partnersList = chatRoom.members.filter(user => user._id.toString() !== userId)
				const unreadMessages = chatRoom.messages.filter(message => message.status !== 'read' && message.senderId === userId)

				// При успешной отправке сообщения, себе передаем ID сообщения, для изменения на клиенте (а именно в компоненте ЧАТА)
				// статуса данного сообщения на "Отправлено"
				socket.emit('chatRoom:changeMessageStatus', {
					newMessage: {
						messageId: newMessage.messageId,
						status: 'sent'
					},
					messageFrom: chatId
				})

				partnersList.forEach(partner => {

					if (!partner.socketId) return

					if (chatRoom.messages.length === 1) {
						const myInformation = chatRoom.members.filter(user => user._id.toString() === userId)

						io.to(partner.socketId).emit('chatRoom:newMessage', {
							newMessage: {
								...newMessage,
								status: 'sent'
							},
							user: {
								_id: myInformation[0]._id,
								nickname: myInformation[0].nickname,
								avatar: UserService.base64BufferToBlob(myInformation[0].avatar, 'data:image/jpeg;base64,'),
								online: Boolean(myInformation[0].socketId),
							},
							messageFrom: chatId,
							unreadMessages: unreadMessages.length
						})

					} else {
						io.to(partner.socketId).emit('chatRoom:newMessage', {
							newMessage: {
								...newMessage,
								status: 'sent'
							},
							messageFrom: chatId,
							unreadMessages: unreadMessages.length
						})
					}

				})

			} catch (e) {
				console.log(e)
			}

		})


		socket.on('chatRoom:deleteMessage', async ({ deletedMessageId, chatId }) => {
			const { userId } = socket.data

			let chatRoom = await ChatRoom.findByIdAndUpdate(
				chatId,
				{
					'$pull': { messages: { messageId: deletedMessageId } }
				},
				{ new: true }
			).populate('members')

			const partnersList = chatRoom.members.filter(user => user._id.toString() !== userId)

			partnersList.forEach(parnter => {
				if (parnter.socketId) {
					io.to(parnter.socketId).emit('chatRoom:deletedMessage', {
						messageId: deletedMessageId
					})
				}
			})

			socket.emit('chatRoom:deletedMessage', { messageId: deletedMessageId })
		})


		socket.on('chatRoom:readMessage', async ({ unreadMessageId, chatId }) => {
			try {

				const { userId } = socket.data

				// У сообщения, которое было прочитанно собеседником, в БД изменяем статус на "Прочитано" // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				let chatRoom = await ChatRoom.findOneAndUpdate(
					{ _id: chatId, 'messages.messageId': unreadMessageId },
					{
						'$set': {
							'messages.$.status': 'read',
						}
					},
					{ new: true }
				).populate('members')

				const partnersList = chatRoom.members.filter(user => user._id.toString() !== userId)
				const unreadMessages = chatRoom.messages.filter(message => message.status !== 'read' && message.senderId !== userId)

				partnersList.forEach(parnter => {
					if (parnter.socketId) { // Если собеседник онлайн
						// Отправляем ему информацию о том, что сообщение было прочитано
						io.to(parnter.socketId).emit('chatRoom:changeMessageStatus', {
							newMessage: {
								messageId: unreadMessageId,
								status: 'read'
							},
							messageFrom: chatId,
						})
					}
				})


				// Если все сообщения прочитаны, то оповещаем клиента об этом (для удаления кол-ва непрочитанных сообщений в СПИСКЕ ВСЕХ ЧАТОВ юзера)
				if (unreadMessages.length === 0) {
					socket.emit('chatRoom:removeUnreadMessagesCount', chatId)
				}

			} catch (e) {
				console.log(e)
			}
		})


		socket.on('chatRoom:callUser', async ({ partnerId }) => {
			const partner = await User.findById(partnerId)

			socket.emit('chatRoom:outgoingCall', {
				partnerId: partner._id,
				partnerNickname: partner.nickname,
				partnerAvatar: UserService.base64BufferToBlob(partner.avatar, 'data:image/jpeg;base64,'),
			})

		})


		socket.on('chatRoom:sendSignal', async ({ partnerId, signal }) => {
			const { userId } = socket.data
			const currentUser = await User.findById(userId)

			const partner = await User.findById(partnerId)

			if (partner.socketId) {
				io.to(partner.socketId).emit('chatRoom:incomingCall', {
					incomingCallInfo: {
						partnerId: currentUser._id,
						partnerNickname: currentUser.nickname,
						partnerAvatar: UserService.base64BufferToBlob(currentUser.avatar, 'data:image/jpeg;base64,'),
					},
					signal
				})
			}
		})


		socket.on('chatRoom:acceptCall', async ({ partnerId, signal }) => {
			const partner = await User.findById(partnerId)

			if (partner.socketId) {
				io.to(partner.socketId).emit('chatRoom:callAccepted', signal)
			}
		})


		socket.on('chatRoom:rejectCall', async ({ partnerId, msg }) => {
			const partner = await User.findById(partnerId)

			if (partner.socketId) {
				io.to(partner.socketId).emit('chatRoom:callRejected', msg)
			}
		})


		socket.on('chatRoom:endCall', async ({ partnerId, msg }) => {
			const { userId } = socket.data

			const partner = await User.findById(partnerId)

			if (partner.socketId) {
				io.to(partner.socketId).emit('chatRoom:callEnded', {callEndInitiatorId: userId, msg})
			}
		})

	})

}

