import { baseUrl } from "../../constants/constants";
import { LOGIN_FALIED, LOGOUT, SET_SETTINGS, SUCCESS_LOGIN, USER_LOADING } from "./actionTypes";
import { initNotification } from "./notification";

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

export const register = (body) => {
	return async dispatch => {
		if (body.email && body.password && body.nickname) {
			dispatch(userLoading(true));

			if (body) {
				body = JSON.stringify(body)
			}

			const response = await fetch(`${baseUrl}/api/auth/register`, {
				method: "POST",
				body,
				headers
			})

			let data = await response.json()

			if (!response.ok && data.message) {
				dispatch(initNotification('error', data.message))
				dispatch(loginFailed())
			}

			if (response.ok && data.accessToken) {
				dispatch(successLogin(data))
				//dispatch(userLoading(false))
			}

			dispatch(userLoading(false))

		}
	}
}

export const login = (body) => {
	return async dispatch => {
		if (body.email && body.password) {
			dispatch(userLoading(true));


			if (body) {
				body = JSON.stringify(body)
			}

			const response = await fetch(`${baseUrl}/api/auth/login`, {
				method: "POST",
				body,
				headers
			})

			let data = await response.json()

			if (!response.ok && data.message) {
				dispatch(initNotification('error', data.message))
				dispatch(loginFailed())
			}

			if (response.ok && data.accessToken) {
				dispatch(successLogin(data))
				//dispatch(userLoading(false))
			}

			dispatch(userLoading(false))

		}
	}
}


export const checkAuth = () => {
	return async dispatch => {

		dispatch(userLoading(true));

		const response = await fetch(`${baseUrl}/api/auth/refresh`, {
			method: "GET",
			credentials: 'include'
		})

		let data = await response.json()

		if (!response.ok && data.message) {
			dispatch(initNotification('error', data.message))
			dispatch(loginFailed())
		}

		if (response.ok && data.accessToken) {
			dispatch(successLogin(data))
		}

		dispatch(userLoading(false))

	}
}


export const logout = () => {
	return async dispatch => {

		dispatch(userLoading(true))

		await fetch(`${baseUrl}/api/auth/logout`, {
			method: "POST"
		})

		dispatch({
			type: LOGOUT
		})

		dispatch(userLoading(false))

	}
}

export const changeSettings = (settings) => {
	return async dispatch => {

		let body

		if (settings) {
			body = JSON.stringify({ settings })
		}

		const response = await fetch(`${baseUrl}/api/auth/settings`, {
			method: "POST",
			body: body,
			headers: {
				...headers,
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		})

		let data = await response.json()

		if (!response.ok && data.message) {
			dispatch(initNotification('error', data.message))
			dispatch(loginFailed())
		}

		if (response.ok && data) {
			dispatch({
				type: SET_SETTINGS,
				payload: data
			})
		}

	}
}

export const successLogin = (data) => ({
	type: SUCCESS_LOGIN,
	payload: data
})

export const userLoading = (data) => ({
	type: USER_LOADING,
	payload: data
})

export const loginFailed = () => ({
	type: LOGIN_FALIED
})
