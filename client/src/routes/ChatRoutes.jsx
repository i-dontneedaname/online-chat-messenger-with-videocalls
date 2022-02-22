import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import Chat from '../Components/Chat/Chat';
import ChatPlug from '../Components/Chat/ChatPlug';

const ChatRoutes = () => {

	const routes = [
		{ path: '/chat/:chatId', element: <Chat /> },
		{ path: '/', element: <ChatPlug /> },
		{ path: '*', element: <Navigate to="/" /> },
	]

	return (
		<Routes>
			{routes.map(route => (
				<Route path={route.path} element={route.element} />
			))}
		</Routes>
	)
}

export default ChatRoutes