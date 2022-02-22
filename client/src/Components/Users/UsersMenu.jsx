import React, { useContext } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AppContext } from '../../Context/AppContext';
//import { AppContext } from '../HomePage/HomePage';

const UsersMenu = props => {

	const {
		anchorElUser,
		handleCloseMenu,
		userId,
		handleCloseUsers
	} = props


	const { socket } = useContext(AppContext)

	const createChat = () => {
		socket.emit('chatRoom:createChat', {partnerId: userId})
		handleCloseMenu()
		handleCloseUsers()
	}


	const menuList = [
		{ text: 'Start chat', onClick: createChat },
	]


	return (
		<Menu
			id="menu-onlineUsersList"
			anchorEl={anchorElUser}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			open={Boolean(anchorElUser)}
			onClose={handleCloseMenu}
		>

			{menuList.map((menuItem) => (
				<MenuItem
					key={menuItem.text}
					onClick={menuItem.onClick}
				>
					{menuItem.text}
				</MenuItem>
			))}

		</Menu>
	)
}

export default UsersMenu