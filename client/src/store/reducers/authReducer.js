import { LOGIN_FALIED, LOGOUT, SET_SETTINGS, SUCCESS_LOGIN, USER_LOADING } from "../actions/actionTypes";



const initialState = {
	isLoading: false,
	isAuth: false,
	_id: '',
	email: '',
	nickname: '',
	avatar: '',
}


export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_LOADING:
			return {
				...state,
				isLoading: action.payload
			}
		case SUCCESS_LOGIN:
			localStorage.setItem('accessToken', action.payload.accessToken);
			return {
				...state,
				_id: action.payload._id,
				email: action.payload.email,
				nickname: action.payload.nickname,
				avatar: action.payload.avatar,
				isAuth: true,
			}
		case LOGOUT:
			localStorage.removeItem('accessToken')
			return {
				...state,
				_id: '',
				email: '',
				nickname: '',
				avatar: '',
				isAuth: false,
			}
		case LOGIN_FALIED:
			if (localStorage.getItem('accessToken')) {
				localStorage.removeItem('accessToken')
			}
			return {
				...state,
				isAuth: false
			}
		case SET_SETTINGS:
			return {
				...state,
				email: action.payload.email,
				nickname: action.payload.nickname,
				avatar: action.payload.avatar,
			}
		default:
			return state;
	}
}