import {combineReducers} from 'redux'
import { authReducer } from './authReducer'
import { notificationReducer } from './notificationReducer'

export const rootReducer = combineReducers({
	auth: authReducer,
	notification: notificationReducer
})