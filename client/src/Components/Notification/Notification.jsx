import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import classes from './notification.module.scss'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';


const Notification = () => {

	const notification = useSelector(state => state.notification.notification)
	const [notifnotificationsList, setNotifnotificationsList] = useState([])


	const deleteNotification = id => {
		setNotifnotificationsList(previous => previous.filter(notif => notif.id !== id))
	}

	useEffect(() => {
		if (Object.keys(notification).length > 0) {
			setNotifnotificationsList(previous => [notification, ...previous])
		}
	}, [notification])


	return notifnotificationsList && notifnotificationsList.length > 0 && (
		<div
			className={classes.list}
		>

			{notifnotificationsList.map(notif => (
				<Alert
					key={notif.id}
					severity={notif.type}
					className={classes.item}
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={() => deleteNotification(notif.id)}
						>
							<CloseIcon />
						</IconButton>
					}
				>
					{notif.text}
				</Alert>
			))}


		</div>
	)
}

export default Notification