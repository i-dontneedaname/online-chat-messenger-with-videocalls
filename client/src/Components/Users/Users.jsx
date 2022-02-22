import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '../../Context/AppContext';
import SearchInput from '../UI/SearchInput/SearchInput';
import UsersList from './UsersList'
import { useInput } from '../../hooks/useInput';
import debounce from 'lodash.debounce'
import { useHttp } from '../../hooks/useHttp';
import classes from './users.module.scss'
import { baseUrl } from '../../constants/constants';


const Users = (props) => {

	const {
		handleCloseUsers = () => {}
	} = props

	const { socket } = useContext(AppContext)

	const _id = useSelector(state => state.auth._id)

	const [users, setUsers] = useState([])
	const input = useInput('')
	const {fetchData, isLoading} = useHttp()


	const getOnlineUsers = async () => {
		const data = await fetchData(`${baseUrl}/api/user/getusers/?online=true`)

		if (data?.onlineUserList) {
			const userListWithoutCurrentUser = data.onlineUserList.filter(user => user._id !== _id)
			setUsers(userListWithoutCurrentUser)
		}
	} 


	const getAllUsers = useCallback(debounce(async() => {
		if (input.value !== "") {
			const data = await fetchData(`${baseUrl}/api/user/getusers/?nickname=${input.value}`)
			
			if (data?.userList) {
				setUsers(data.userList)
			}
		} else {
			getOnlineUsers()
		}
	}, 500), [input.value])


	const userStatusChangeHandler = user => {
		if (input.value !== "") return

		if (user.online) {
			setUsers(prev => [...prev, user])
		} else {
			setUsers(prev => prev.filter(onlineUser => onlineUser._id !== user._id))
		}
	}



	useEffect(() => {
		
		getOnlineUsers()

	}, [])


	useEffect(() => {

		getAllUsers()

		return getAllUsers.cancel

	}, [getAllUsers])


	useEffect(() => {

		socket.on('user:changeUserStatus', userStatusChangeHandler)

		return () => {
			socket.off('user:changeUserStatus', userStatusChangeHandler)
		}

	}, [input.value])


	return (
		<>
			<p className={classes.header}>
				Online users
			</p>

			<SearchInput
				value={input.value}
				onChange={input.onChange}
			/>

			<UsersList
				isLoading={isLoading}
				inputValue={input.value}
				users={users}
				handleCloseUsers={handleCloseUsers}
			/>
		</>
	)
}

export default Users




//<div>
//{isLoading ? (
//	<div>LOADING</div>
//) : (

//	searchUsers.value ? (
		
//		allUsers && allUsers.length > 0 ? (
//			allUsers.map(user => (
//				<UsersListItem
//					key={user._id}
//					user={user}
//				/>
//			))
//		) : (
//			<div>UNKNOWN USER</div>
//		)

//	) : (

//		onlineUsers && onlineUsers.length > 0 ? (
//			onlineUsers.map(user => (
//				<UsersListItem
//					key={user._id}
//					user={user}
//				/>
//			))
//		) : (
//			<div>NOBODY IS ONLINE</div>
//		)

//	)

//)}
//</div>