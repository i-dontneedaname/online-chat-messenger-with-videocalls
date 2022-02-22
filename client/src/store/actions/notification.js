import { SET_NOTIFICATION } from "./actionTypes";
import { v4 } from 'uuid'


export const initNotification = (type, text) => {
	const data = {
		id: v4(),
		type,
		text
	}

	return {
		type: SET_NOTIFICATION,
		payload: data
	}
}