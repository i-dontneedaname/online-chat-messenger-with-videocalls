import { useState, useEffect } from "react"
import { io } from 'socket.io-client'


export const useSocket = () => {

	const [newSocket, setNewSocket] = useState(null)

	useEffect(() => {

		//const socket = io("ws://localhost:5000", {
		const socket = io("wss://online-chat-messenger.herokuapp.com", {
			"force new connection": true,
			reconnectionAttempts: "Infinity",
			timeout: 10000,
			transports: ["websocket"],
			query: {
				token: localStorage.getItem('accessToken')
			}
		})

		socket.emit('user:setSocketId')

		setNewSocket(socket)

		return () => {
			socket.disconnect('user:setSocketId')
		}

	}, [])

	return {
		newSocket
	}

}