import React from 'react';
import Button from '@mui/material/Button'
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import UserAvatar from '../UI/UserAvatar/UserAvatar'
import classes from './call.module.scss'

const VideoCallNotification = (props) => {

	const {
		callInfo: { partnerNickname, partnerAvatar },
		acceptCall,
		rejectCall
	} = props


	return (
		<>
			<div className={classes.notification}>

				<div className={classes.avatar}>
					<UserAvatar
						avatarData={partnerAvatar}
						nickname={partnerNickname}
						width={70}
						height={70}
					/>
				</div>

				<p className={classes.nickname}>
					{partnerNickname}
				</p>

			</div>

			<div
				className={classes.btns}
			>
				<Button
					onClick={acceptCall}
					variant="outlined"
				>
					<CallIcon />
				</Button>

				<Button
					onClick={rejectCall}
					variant="outlined"
				>
					<CallEndIcon />
				</Button>
			</div>
		</>
	)
}

export default VideoCallNotification