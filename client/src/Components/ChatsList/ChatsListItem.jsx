import React from 'react';
import { NavLink } from 'react-router-dom'
import UserAvatar from '../UI/UserAvatar/UserAvatar';
import Badge from '@mui/material/Badge';
import { chatListTimestampConverter } from '../../utils/dateUtils'
import { useSelector } from 'react-redux';
import classes from './chats.module.scss'
import MessageStatus from '../UI/MessageStatus/MessageStatus';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';



const ChatsListItem = (props) => {

	const {
		chat,
		handleCloseChatsList
	} = props

	const _id = useSelector(state => state.auth._id)

	const linkClickHandler = () => {
		handleCloseChatsList()
	}

	return (
		<NavLink
			to={`/chat/${chat.chatId}`}
			className={
				({ isActive }) => [
					isActive ? classes.active : undefined,
					classes.item
				].filter(Boolean).join(' ')
			}
			onClick={linkClickHandler}
		>

			<UserAvatar
				avatarData={chat.user.avatar}
				nickname={chat.user.nickname}
				online={chat.user.online}
				width={55}
				height={55}
			/>

			<div className={classes.basicInfo}>
				<p className={classes.nickname}>
					{chat.user.nickname}
				</p>
				<p className={classes.message}>
					{chat.lastMessage && (
						<>
							<span className={classes.status}>
								{chat.lastMessage.senderId === _id && (
									<MessageStatus status={chat.lastMessage.status} />
								)}
								{chat.lastMessage.voiceMessage && (
									<MicIcon sx={{ fontSize: '1rem' }} />
								)}
								{chat.lastMessage.images.length > 0 && (
									<CameraAltIcon sx={{ fontSize: '1rem' }} />
								)}
							</span>
							{chat.lastMessage.text}
						</>
					)}
				</p>
			</div>

			<div className={classes.otherInfo}>
				<div className={classes.time}>
					{chat.lastMessage ? chatListTimestampConverter(chat.lastMessage.createdAt) : null}
				</div>
				<div className={classes.messages}>
					<Badge
						badgeContent={chat.unreadMessages ? chat.unreadMessages : null}
						max={9}
						color="primary"
					/>
				</div>
			</div>

		</NavLink >
	)
}

export default ChatsListItem

