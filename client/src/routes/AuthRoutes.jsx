import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from '../Components/Authorization/SignIn'
import SignUp from '../Components/Authorization/SignUp'



const AuthRoutes = () => {

	const routes = [
		{ path: '/signin', element: <SignIn /> },
		{ path: '/signup', element: <SignUp /> },
		{ path: '*', element: <Navigate to="/signin" /> },
	]

	return (
		<Routes>
			{routes.map(route => (
				<Route path={route.path} element={route.element} />
			))}
		</Routes>
	)
}

export default AuthRoutes