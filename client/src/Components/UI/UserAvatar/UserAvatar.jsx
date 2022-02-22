import React from 'react'
import Avatar from '@mui/material/Avatar'
import { stringToColor } from '../../../utils/stringAvatar'
import classes from './userAvatar.module.scss'
import CircleIcon from '@mui/icons-material/Circle';

const UserAvatar = (props) => {

	const {
		avatarData,
		nickname,
		online = null,
		width = null,
		height = null
	} = props

	return (
		<div
			className={classes.wrapper}
		>
			<Avatar
				src={avatarData ? avatarData : null}
				children={avatarData ? null : nickname[0]}
				sx={{
					width: width && `${width}px`,
					height: height && `${height}px`,
					//border: online && '2px solid #1976d2',
					backgroundColor: !avatarData && stringToColor(nickname)
				}}
			/>

			{online && (
				<CircleIcon
					sx={{
						position: 'absolute',
						fontSize: '11px',
						right: '5%',
						bottom: '4%',
						color: '#1976d2'
					}}
				/>
			)}
		</div>

	)
}

export default UserAvatar