import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader/ChatHeader'
import MessagesList from './Messages/MessagesList';
import ChatInput from './ChatInput/ChatInput';
import classes from './chat.module.scss'
import { useHttp } from '../../hooks/useHttp';
import Loader from '../UI/Loader/Loader';
import { baseUrl } from '../../constants/constants';


const Chat = () => {

	const { chatId } = useParams()

	const [initialMessages, setInitialMessages] = useState([])
	const [initialUserInfo, setInitialUserInfo] = useState({})
	const { fetchData, isLoading } = useHttp()


	useEffect(() => {

		const getChat = async () => {
			const data = await fetchData(`${baseUrl}/api/chats/chat/${chatId}/?messages=true&userInfo=true`)

			if (data.chatMessages && data.chatInfo) {
				setInitialMessages(data.chatMessages.messages)
				setInitialUserInfo(data.chatInfo.user)
			}
		}

		setInitialMessages([])
		setInitialUserInfo({})
		getChat()

	}, [chatId])


	return !isLoading && Object.keys(initialUserInfo).length > 0 ? (
		<div className={classes.wrapper}>
			<ChatHeader
				initialUserInfo={initialUserInfo}
			/>

			<MessagesList
				initialMessages={initialMessages}
				chatId={chatId}
			/>

			<ChatInput
				chatId={chatId}
			/>
		</div>
	) : (
		<Loader />
	)
}

export default Chat