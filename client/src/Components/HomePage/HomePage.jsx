import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav'
import MainContent from '../MainContent/MainContent';
import VideoCallWrapper from '../VideoCall/VideoCallWrapper';
import jsonEmoji from '../../utils/emoji/simple-emoji-list.json'
import { decodeEmoji } from '../../utils/emoji/decodeEmoji';
import Loader from '../UI/Loader/Loader';
import { AppContext } from '../../Context/AppContext';
import { useSocket } from '../../hooks/useSocket'


const HomePage = () => {

	const { newSocket } = useSocket()

	const [socket, setSocket] = useState(null)
	const [emojiList, setEmojiList] = useState([])


	useEffect(() => {
		const json = Object.values(jsonEmoji)
		const newList = json.flat().map(emoji => ({
			...emoji,
			code: decodeEmoji(emoji.code)
		}))

		setEmojiList(newList)
	}, [])


	useEffect(() => {
		setSocket(newSocket)
	}, [newSocket])


	return socket ? (
		<AppContext.Provider value={{ socket, emojiList }}>

			<Nav />

			<MainContent />

			<VideoCallWrapper />

		</AppContext.Provider>
	) : (
		<Loader />
	)
}

export default HomePage