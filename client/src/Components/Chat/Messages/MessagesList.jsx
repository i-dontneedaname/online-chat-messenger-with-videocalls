import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AppContext } from '../../../Context/AppContext';
import Message from './Message';
import { useHttp } from '../../../hooks/useHttp'
import throttle from 'lodash.throttle'
import classes from '../chat.module.scss'
import Loader from '../../UI/Loader/Loader';
import MessageMenu from './MessageMenu';
import Plug from '../../UI/Plug/Plug'
import { baseUrl } from '../../../constants/constants';



const MessagesList = ({ initialMessages, chatId }) => {

	const { socket } = useContext(AppContext)

	const [messages, setMessages] = useState(initialMessages)
	const [hasMore, setHasMore] = useState(true)
	const [deletingMessageId, setDeletingMessageId] = useState(null)
	const [anchorEl, setAnchorEl] = useState(null)

	const wrapperRef = useRef(null)

	const { fetchData, isLoading } = useHttp()


	const handleOpenMenu = useCallback((event, messageId) => {
		setDeletingMessageId(messageId)
		setAnchorEl(event.currentTarget)
	}, [])


	const handleCloseMenu = () => {
		setAnchorEl(null)
	}


	const newMessageHandler = ({ newMessage, messageFrom }) => {
		if (chatId !== messageFrom) return

		setMessages(prev => [...prev, newMessage])
	}


	const handleChangeMessageStatus = ({ newMessage, messageFrom }) => {
		if (chatId !== messageFrom) return

		setMessages(prev => prev.map(message => {
			if (message.messageId === newMessage.messageId) {
				return {
					...message,
					status: newMessage.status
				}
			}
			return message
		}))
	}


	const deletedMessageHandler = (messageInfo) => {
		setMessages(prev => prev.filter(message => message.messageId !== messageInfo.messageId))
	}


	const getMessages = async (url) => {
		const data = await fetchData(url)

		if (data?.chatMessages) {
			setMessages(prev => [...data.chatMessages.messages, ...prev])
			setHasMore(data.chatMessages.messages.length > 0)
		}
	}


	const scrollHandler = useCallback(throttle(async (event) => {
		if (event.target.scrollTop <= 0) {
			const to = event.target.scrollHeight
			await getMessages(`${baseUrl}/api/chats/chat/${chatId}/?messages=true&messageId=${messages[0].messageId}`)
			event.target.scrollTop = event.target.scrollHeight - to
		}
	}, 325), [messages, chatId])



	useEffect(() => {

		socket.on('chatRoom:changeMessageStatus', handleChangeMessageStatus)
		socket.on('chatRoom:newMessage', newMessageHandler)
		socket.on('chatRoom:deletedMessage', deletedMessageHandler)

		return () => {
			socket.off('chatRoom:changeMessageStatus', handleChangeMessageStatus)
			socket.off('chatRoom:newMessage', newMessageHandler)
			socket.off('chatRoom:deletedMessage', deletedMessageHandler)
		}

	}, [])


	return (
		<div
			className={classes.list}
			ref={wrapperRef}
			onScroll={hasMore && !isLoading ? scrollHandler : null}
		>

			{isLoading && <Loader />}

			{messages && messages.length > 0 ? (
				messages.map((message, index) => (
					<Message
						key={message.messageId}
						message={message}
						isLast={messages.length - 1 === index}
						chatId={chatId}
						handleOpenMenu={handleOpenMenu}
					/>
				))
			) : (
				<Plug>
					chat is empty
				</Plug>
			)}


			{Boolean(anchorEl) && (
				<MessageMenu
					anchorEl={anchorEl}
					handleCloseMenu={handleCloseMenu}
					messageId={deletingMessageId}
					chatId={chatId}
				/>
			)}

		</div>
	)
}

export default MessagesList

