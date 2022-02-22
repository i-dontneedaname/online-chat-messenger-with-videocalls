import React from 'react';
import classes from './users.module.scss'
import UserAvatar from '../UI/UserAvatar/UserAvatar';


const UsersListItem = props => {

	const {
		user,
		handleOpenMenu
	} = props

	const clickHandler = event => {
		handleOpenMenu(event, user._id)
	}

	return (
		<div
			className={classes.item}
			onClick={clickHandler}
		>

			<UserAvatar
				avatarData={user.avatar}
				nickname={user.nickname}
				online={user.online}
				width={35}
				height={35}
			/>

			<p className={classes.nickname}>
				{user.nickname}
			</p>

		</div>
	)
}

export default UsersListItem

