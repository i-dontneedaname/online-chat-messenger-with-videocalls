import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../../store/actions/auth';
import Settings from './Settings';





const NavUserMenuList = (props) => {

	const {
		anchorElUser,
		handleCloseUserMenu
	} = props

	const dispatch = useDispatch()

	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	const handleOpenSettings = () => {
		setIsSettingsOpen(true)
		handleCloseUserMenu()
	}

	const handleCloseSettings = () => {
		setIsSettingsOpen(false)
	}

	const handleLogot = () => {
		dispatch(logout())
	}

	const navList = [
		{ text: 'Settings', onClick: handleOpenSettings },
		{ text: 'Logout', onClick: handleLogot }
	]



	return (
		<>

			<Menu
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>

				{navList.map(navItem => (
					<MenuItem
						key={navItem.text}
						onClick={navItem.onClick}
					>
						{navItem.text}
					</MenuItem>
				))}

			</Menu>

			{isSettingsOpen && (
				<Settings
					isSettingsOpen={isSettingsOpen}
					handleCloseSettings={handleCloseSettings}
				/>
			)}

		</>
	)
}

export default NavUserMenuList