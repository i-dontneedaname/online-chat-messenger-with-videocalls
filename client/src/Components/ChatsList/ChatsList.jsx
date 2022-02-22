import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../UI/SearchInput/SearchInput'
import ChatsListItem from './ChatsListItem';
import { AppContext } from '../../Context/AppContext';
import { useInput } from '../../hooks/useInput';
import { useHttp } from '../../hooks/useHttp'
import classes from './chats.module.scss'
import Loader from '../UI/Loader/Loader';
import Plug from '../UI/Plug/Plug';
import { baseUrl } from '../../constants/constants';



const ChatsList = (props) => {

	const {
		handleCloseChatsList = () => { }
	} = props

	const { socket } = useContext(AppContext)
	const navigate = useNavigate()

	const [chats, setChats] = useState([])
	const chatSearch = useInput('')

	const { fetchData, isLoading } = useHttp()


	const createdChatHandler = ({ chatId, user, lastMessage, unreadMessage, isNew }) => {
		if (isNew) {
			setChats(previousState => [{ chatId, user, lastMessage, unreadMessage, }, ...previousState])
		}

		navigate(`${baseUrl}/chat/${chatId}`)
	}


	const onLastMessageStatusChange = ({ newMessage, unreadMessages }) => {

		const isExist = chats.find(chat => chat.lastMessage?.messageId === newMessage.messageId)

		if (!isExist) return

		setChats(previousState => previousState.map(chat => {
			if (chat.lastMessage?.messageId === newMessage.messageId) {
				return {
					...chat,
					unreadMessages,
					lastMessage: {
						...chat.lastMessage,
						status: newMessage.status
					}
				}
			}
			return chat
		}))
	}
	

	const handleAddLastMessage = ({ newMessage, messageFrom, unreadMessages, user }) => {
		setChats(previousState => {
			const isChatInList = previousState.find(chat => chat.chatId === messageFrom)

			if (isChatInList) {
				const newList = previousState.filter(chat => chat.chatId !== isChatInList.chatId)

				return [
					{
						...isChatInList,
						unreadMessages,
						lastMessage: newMessage
					},
					...newList
				]
			} else {
				return [
					{
						chatId: messageFrom,
						user,
						unreadMessages,
						lastMessage: newMessage
					},
					...previousState
				]
			}
		})
	}

	const onUserStatusChange = (user) => {
		const isUserInChatList = chats.find(chat => chat.user._id === user._id)

		if (isUserInChatList) {
			setChats(previousState => previousState.map(chat => {
				if (chat.user._id === user._id) {
					return {
						...chat,
						user: {
							...chat.user,
							online: user.online
						}
					}
				}

				return chat
			}))
		}
	}


	const removeUnreadMessages = (chatId) => {
		setChats(previousState => (previousState.map(chat => {
			if (chatId === chat.chatId) {
				return {
					...chat,
					unreadMessages: 0
				}
			}
			return chat
		})))
	}


	useEffect(() => {

		const getChats = async () => {
			const data = await fetchData(`${baseUrl}/api/chats/getalluserschats`)

			if (data?.chats) {
				setChats(data.chats)
			}
		}

		getChats()

	}, [])


	useEffect(() => {

		socket.on('chatRoom:onChatCreate', createdChatHandler)
		socket.on('chatRoom:newMessage', handleAddLastMessage)
		socket.on('chatRoom:removeUnreadMessagesCount', removeUnreadMessages)


		return () => {
			socket.off('chatRoom:onChatCreate', createdChatHandler)
			socket.off('chatRoom:newMessage', handleAddLastMessage)
			socket.off('chatRoom:removeUnreadMessagesCount', removeUnreadMessages)
		}

	}, [])

	useEffect(() => {
		socket.on('user:changeUserStatus', onUserStatusChange)
		socket.on('chatRoom:changeMessageStatus', onLastMessageStatusChange)
		return () => {
			socket.off('user:changeUserStatus', onUserStatusChange)
			socket.off('chatRoom:changeMessageStatus', onLastMessageStatusChange)
		}
	}, [chats])


	return (
		<>

			<p className={classes.header}>
				Your Chats
			</p>

			<SearchInput
				value={chatSearch.value}
				onChange={chatSearch.onChange}
			/>

			<div
				className={classes.list}
			>
				{!isLoading ? (
					chats && chats.length > 0 ? (
						chats.filter(chat => chat.user.nickname.toLowerCase().includes(chatSearch.value.toLowerCase()))
							.map(chat => (
								<ChatsListItem
									chat={chat}
									handleCloseChatsList={handleCloseChatsList}
									key={chat.chatId}
								/>
							))
					) : (
						<Plug>
							no chats
						</Plug>
					)
				) : (
					<Loader />
				)}
			</div>

		</>
	)
}

export default ChatsList