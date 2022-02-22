import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavUserMenuList from './NavUserMenuList';
import { useSelector } from 'react-redux';
import UserAvatar from '../UI/UserAvatar/UserAvatar';



const NavUserMenu = () => {

	const nickname = useSelector(state => state.auth.nickname)
	const avatar = useSelector(state => state.auth.avatar)

	const [anchorElUser, setAnchorElUser] = useState(null)


	const handleOpenUserMenu = event => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}



	return (
		<div>

			<Tooltip title="Open settings">
				<IconButton
					onClick={handleOpenUserMenu}
				>
					<UserAvatar
						avatarData={avatar}
						nickname={nickname}
					/>
				</IconButton>
			</Tooltip>

			<NavUserMenuList
				anchorElUser={anchorElUser}
				handleCloseUserMenu={handleCloseUserMenu}
			/>

		</div>
	)
}

export default NavUserMenu