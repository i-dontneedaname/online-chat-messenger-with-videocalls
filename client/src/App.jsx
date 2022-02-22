import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/actions/auth';
import HomePage from './Components/HomePage/HomePage';
import Notification from './Components/Notification/Notification';
import Authorization from './Components/Authorization/Authorization';
import './App.css';




const App = () => {

	const dispatch = useDispatch()
	const isAuth = useSelector(state => state.auth.isAuth)


	useEffect(() => {

		if (localStorage.getItem('accessToken')) {
			dispatch(checkAuth());
		}

	}, [])




	return (
		<>
			{ isAuth ? (
				<HomePage />
			) : (
				<Authorization />
			)}

			<Notification />
		</>
	)
}

export default App;
