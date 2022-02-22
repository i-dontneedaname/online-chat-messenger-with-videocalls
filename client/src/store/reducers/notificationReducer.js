import { SET_NOTIFICATION } from "../actions/actionTypes";



const initialState = {
	notification: {}
}


export const notificationReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_NOTIFICATION:
			return {
				...state,
				notification: action.payload,
			}
		default:
			return state;
	}
}