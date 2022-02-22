import React, { useContext, useEffect, useRef, memo } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { messageTimestampConverter } from '../../../utils/dateUtils'
import { useSelector } from 'react-redux';
import { AppContext } from '../../../Context/AppContext';
//import { AppContext } from '../../HomePage/HomePage';
import MessageStatus from '../../UI/MessageStatus/MessageStatus';
import classes from '../chat.module.scss'
import VoicePlayer from '../../UI/VoicePlayer/VoicePlayer';
import Image from '../../UI/Image/Image'





const Message = props => {

	const {
		message,
		chatId,
		isLast,
		handleOpenMenu
	} = props

	const { socket } = useContext(AppContext)

	const _id = useSelector(state => state.auth._id)

	const lastItemRef = useRef(null)


	const clickHandler = event => {
		handleOpenMenu(event, message.messageId)
	}


	useEffect(() => {

		if (message.status === 'sent' && message.senderId !== _id) {
			socket.emit('chatRoom:readMessage', { unreadMessageId: message.messageId, chatId })
		}

		if (isLast) {
			lastItemRef.current?.scrollIntoView({ block: "start" })
		}

	}, [])


	return (
		<div
			ref={lastItemRef}
			className={
				[
					classes.messageWrapper,
					message.senderId === _id ? classes.my : classes.partners
				].join(' ')
			}
		>

			<IconButton
				className={classes.settings}
				onClick={clickHandler}
			>
				<MoreHorizIcon />
			</IconButton>

			<div
				className={classes.message}
			>

				<p className={classes.nickname}>
					{message.senderNickname}
				</p>

				<div className={classes.content}>
					{message.text && (
						<p className={classes.text}>
							{message.text}
						</p>
					)}

					{message.images.length > 0 && (
						<div className={classes.images}>
							{message.images.map(image => (
								<Image
									key={Math.random + image}
									imgData={image}
								/>
							))}
						</div>
					)}

					{message.voiceMessage && (
						<VoicePlayer
							audioData={message.voiceMessage}
						/>
					)}
				</div>

				<div className={classes.info}>
					{message.senderId === _id && (
						<span className={classes.status}>
							<MessageStatus status={message.status} />
						</span>
					)}
					&nbsp;{messageTimestampConverter(message.createdAt)}
				</div>



			</div>

		</div>
	)
}

export default memo(Message)
