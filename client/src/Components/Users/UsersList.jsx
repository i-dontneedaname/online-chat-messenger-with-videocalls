import React from 'react';
import { useSelector } from 'react-redux'
import UsersListItem from './UsersListItem';
import classes from './users.module.scss'
import Loader from '../UI/Loader/Loader';
import UsersMenu from './UsersMenu'
import Plug from '../UI/Plug/Plug';


const UsersList = (props) => {

	const {
		isLoading,
		inputValue,
		users,
		handleCloseUsers
	} = props

	const _id = useSelector(state => state.auth._id)

	const [anchorElUser, setAnchorElUser] = React.useState(null)
	const [userId, setUserId] = React.useState(null)


	const handleOpenMenu = React.useCallback((event, id) => {
		if (id === _id) return
		setUserId(id)
		setAnchorElUser(event.currentTarget)
	}, [])

	const handleCloseMenu = () => {
		setAnchorElUser(null)
	}


	return (
		<>
			<div
				className={classes.list}
			>
				{isLoading ? (
					<Loader />
				) : (

					inputValue ? (

						users && users.length > 0 ? (
							users.map(user => (
								<UsersListItem
									key={user._id}
									user={user}
									handleOpenMenu={handleOpenMenu}
								/>
							))
						) : (
							<Plug>
								user not found
							</Plug>
						)

					) : (

						users && users.length > 0 ? (
							users.map(user => (
								<UsersListItem
									key={user._id}
									user={user}
									handleOpenMenu={handleOpenMenu}
								/>
							))
						) : (
							<Plug>
								nobody is online
							</Plug>
						)

					)

				)}
			</div>


			<UsersMenu
				anchorElUser={anchorElUser}
				handleCloseMenu={handleCloseMenu}
				userId={userId}
				handleCloseUsers={handleCloseUsers}
			/>

		</>
	)
}

export default UsersList