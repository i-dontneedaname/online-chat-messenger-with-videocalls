import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, loginFailed } from '../store/actions/auth'
import { initNotification } from "../store/actions/notification";

export const useHttp = () => {
	const dispatch = useDispatch()

	const isAuthLoading = useSelector(state => state.auth.isLoading)
	const [isLoading, setIsLoading] = useState(false)
	const [checkAuthFlag, setCheckAuthFlag] = useState(false)
	const [url, setUrl] = useState(null)


	const fetchData = async (url, method = "GET") => {

		setUrl(url)

		setIsLoading(true)

		const response = await fetch(url, {
			method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		})

		let data = await response.json()

		if (!response.ok && response.status === 401 && localStorage.getItem('accessToken')) {
			setIsLoading(true)

			dispatch(checkAuth())
			setCheckAuthFlag(true)
		}

		if (!response.ok && response.status !== 401) {
			dispatch(initNotification('error', data.message))
			dispatch(loginFailed())
			setIsLoading(false)
		}

		if (response.ok) {
			setIsLoading(false)
			return data
		}
	}


	useEffect(() => {
		if (!isAuthLoading && checkAuthFlag) {
			fetchData(url)
			setCheckAuthFlag(false)
		}
	}, [isAuthLoading, checkAuthFlag])


	return {
		fetchData,
		isLoading,
	}

}


//const dispatch = useDispatch()

//const isAuthLoading = useSelector(state => state.auth.isLoading)
//const [data, setData] = useState(null)
//const [isLoading, setIsLoading] = useState(false)
//const [checkAuthFlag, setCheckAuthFlag] = useState(false)
//const [url, setUrl] = useState(initUrl)
////const [params, setParams] = useState(initParams)
//const [query, setQuery] = useState(initQuery)
//const [skip, setSkip] = useState(skipWhenInit)


//const fetchData = async (url, skip, query = "") => {

//	if (skip) {
//		setSkip(false)
//		return
//	}
	

//	setIsLoading(true)

//	const response = await fetch(`${url}/?${query}`, {
//		method,
//		headers: {
//			'Accept': 'application/json',
//			'Content-Type': 'application/json',
//			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//		}
//	})

//	let data = await response.json()

//	if (!response.ok && response.status === 401 && localStorage.getItem('accessToken')) {
//		setIsLoading(true)

//		dispatch(checkAuth())
//		setCheckAuthFlag(true)
//	}

//	if (!response.ok && response.status !== 401) {
//		dispatch(setError(data.message))
//		setIsLoading(false)
//	}

//	if (response.ok) {
//		setData(data)
//		console.log(data)
//		setIsLoading(false)
//	}
//}


//const refetch = async (url, query = "") => {
//	await fetchData(url, false, query)
//}


//useEffect(() => {

//	fetchData(url, skip, query)

//}, [url, query])

//useEffect(() => {
//	if (!isAuthLoading && checkAuthFlag) {
//		fetchData()
//		setCheckAuthFlag(false)
//	}
//}, [isAuthLoading, checkAuthFlag])

//return {
//	data,
//	isLoading,
//	refetch,
//	setUrl,
//	setQuery
//}

//}