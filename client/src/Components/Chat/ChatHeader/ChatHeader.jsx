import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VideocamIcon from '@mui/icons-material/Videocam';
import { AppContext } from '../../../Context/AppContext'
import classes from '../chat.module.scss'


const ChatHeader = props => {

	const {
		initialUserInfo,
	} = props

	const { socket } = useContext(AppContext)
	const navigate = useNavigate()

	const [userInfo, setUserInfo] = useState(initialUserInfo)


	const onPartnerStatusChange = (user) => {
		if (user._id !== userInfo._id) return

		setUserInfo(prev => ({
			...prev,
			online: user.online
		}))
	}


	const closeChat = () => {
		navigate('/')
	}


	const callUser = () => {
		socket.emit('chatRoom:callUser', { partnerId: userInfo._id })
	}


	useEffect(() => {
		socket.on('user:changeUserStatus', onPartnerStatusChange)

		return () => {
			socket.off('user:changeUserStatus', onPartnerStatusChange)
		}
	}, [userInfo])



	return (
		<div className={classes.header}>

			<IconButton
				onClick={closeChat}
				className={classes.back}
			>
				<ArrowBackIosIcon sx={{ fontSize: '0.8rem' }} />
			</IconButton>


			<UserAvatar
				avatarData={userInfo.avatar}
				nickname={userInfo.nickname}
				online={userInfo.online}
			/>


			<p className={classes.nickname}>
				{userInfo.nickname}
			</p>

			<Tooltip title="The call is only available if both users are online">
				<div>
					<IconButton
						onClick={callUser}
						disabled={!userInfo.online}
					>
						<VideocamIcon />
					</IconButton>
				</div>
			</Tooltip>

		</div>
	)
}

export default ChatHeader