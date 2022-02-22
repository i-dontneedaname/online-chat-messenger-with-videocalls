import { useState, useEffect, useRef, useContext } from 'react'
import Peer from 'simple-peer'
import { AppContext } from '../Context/AppContext'
import { useDispatch } from 'react-redux'
import { initNotification } from '../store/actions/notification'

export const useVideoCall = () => {

	const dispatch = useDispatch()

	const { socket } = useContext(AppContext)


	const [callInfo, setCallInfo] = useState({})
	const [isReceived, setIsReceived] = useState(null)
	const [isCallStarted, setIsCallStarted] = useState(false)
	const [stream, setStream] = useState(null)
	const [isCallAccepted, setIsCallAccepted] = useState(false)


	const localMediaStream = useRef(null)
	const userVideo = useRef(null)
	const connectionRef = useRef(null)


	const startCapture = async (partnerId) => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: {
					width: 480,
					height: 640
				}
			})

			setStream(localStream)
			localMediaStream.current.volume = 0
			localMediaStream.current.srcObject = localStream
		} catch (e) {
			handleStopCall(partnerId, null, 'You have problems with your camera or microphone. Please check their functionality or access in the settings')
		}
	}


	const handleInitiateCall = outgoingCallInfo => {
		setCallInfo({
			...outgoingCallInfo
		})

		setIsReceived(false)
		setIsCallStarted(true)

		startCapture(outgoingCallInfo.partnerId)
	}


	const handleStopCall = (partnerId = null, message = null, error = null) => {
		if (partnerId && error) {
			socket.emit('chatRoom:endCall', { partnerId })
			dispatch(initNotification('error', error))
		}
		else if (partnerId) {
			socket.emit('chatRoom:endCall', { partnerId })
			dispatch(initNotification('info', "Call ended"))
		}
		else {
			dispatch(initNotification('info', message ? message : "Call ended"))
		}

		resetComponent()
	}


	const incomingCallHandler = ({ incomingCallInfo, signal }) => {
		if (Object.keys(callInfo).length > 0) {
			socket.emit('chatRoom:endCall', { partnerId: incomingCallInfo.partnerId, msg: 'User is busy now' })
			return
		}

		setIsReceived(true)


		setCallInfo({
			signal,
			...incomingCallInfo
		})
	}


	const acceptCall = () => {
		setIsCallStarted(true)

		startCapture(callInfo.partnerId)
	}


	const rejectCall = () => {
		socket.emit('chatRoom:endCall', { partnerId: callInfo.partnerId, msg: 'Call rejected' })
		resetComponent()
	}


	const callUser = () => {
		const peer = new Peer({ initiator: true, trickle: false, stream })

		peer.on('signal', (data) => {
			socket.emit('chatRoom:sendSignal', { partnerId: callInfo.partnerId, signal: data })
		})

		peer.on('stream', (currentStream) => {
			userVideo.current.srcObject = currentStream
		})

		peer.on('close', () => {
			handleStopCall()
		})

		peer.on('error', () => {
			handleStopCall()
		})


		socket.on('chatRoom:callAccepted', (signal) => {
			peer.signal(signal)

			setIsCallAccepted(true)
		})

		connectionRef.current = peer
	}


	const answerCall = () => {

		const peer = new Peer({ initiator: false, trickle: false, stream })

		peer.on('signal', (data) => {
			socket.emit('chatRoom:acceptCall', { partnerId: callInfo.partnerId, signal: data })
		})

		peer.on('stream', (currentStream) => {
			userVideo.current.srcObject = currentStream
		})

		peer.on('close', () => {
			handleStopCall()
		})

		peer.on('error', () => {
			handleStopCall()
		})

		peer.signal(callInfo.signal)

		connectionRef.current = peer

		setIsCallAccepted(true)
	}


	const resetComponent = () => {
		if (stream) {
			stream.getTracks().forEach(track => {
				track.stop()
			})
		}

		connectionRef.current?.removeAllListeners('signal')
		connectionRef.current?.removeAllListeners('stream')
		connectionRef.current?.removeAllListeners('close')
		connectionRef.current?.removeAllListeners('error')

		connectionRef.current?.destroy()

		socket.off('chatRoom:callAccepted')

		connectionRef.current = null
		localMediaStream.current = null
		userVideo.current = null


		setIsReceived(null)
		setIsCallStarted(false)
		setCallInfo({})
		setStream(null)
		setIsCallAccepted(false)
	}


	useEffect(() => {

		if (!stream) return

		if (isReceived) {
			answerCall()
		} else {
			callUser()
		}

	}, [stream])


	const endedCallHandler = ({ callEndInitiatorId, msg }) => {
		if (callEndInitiatorId === callInfo.partnerId) {
			handleStopCall(null, msg, null)
		}
	}


	useEffect(() => {
		socket.on('chatRoom:callEnded', endedCallHandler)

		return () => {
			socket.off('chatRoom:callEnded', endedCallHandler)
		}

	}, [stream, connectionRef.current, callInfo])



	useEffect(() => {
		socket.on('chatRoom:outgoingCall', handleInitiateCall)

		return () => {
			socket.off('chatRoom:outgoingCall', handleInitiateCall)
		}

	}, [])


	useEffect(() => {
		socket.on('chatRoom:incomingCall', incomingCallHandler)

		return () => {
			socket.off('chatRoom:incomingCall', incomingCallHandler)
		}

	}, [callInfo])


	return {
		callInfo,
		isReceived,
		isCallStarted,
		isCallAccepted,
		stream,
		localMediaStream,
		userVideo,
		handleStopCall,
		acceptCall,
		rejectCall
	}
}