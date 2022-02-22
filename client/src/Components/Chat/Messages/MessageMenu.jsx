import React, { useContext } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AppContext } from '../../../Context/AppContext';

const MessageMenu = props => {

	const {
		anchorEl,
		handleCloseMenu,
		messageId,
		chatId
	} = props

	const { socket } = useContext(AppContext)

	const deleteMessage = () => {
		socket.emit('chatRoom:deleteMessage', { deletedMessageId: messageId, chatId })
		handleCloseMenu()
	}

	const messageMenuItems = [
		{ title: 'Delete', onClick: deleteMessage }
	]


	return (
		<Menu
			id="demo-positioned-menu"
			aria-labelledby="demo-positioned-button"
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleCloseMenu}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
		>
			{messageMenuItems.map(item => {
				return (
					<MenuItem
						key={item.title}
						onClick={item.onClick}
					>
						{item.title}
					</MenuItem>
				)
			})}
		</Menu>
	)
}

export default MessageMenu