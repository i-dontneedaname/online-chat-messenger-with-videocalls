import React, { useContext, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import InputBase from '@mui/material/InputBase';
import { useInput } from '../../../hooks/useInput';
import { AppContext } from '../../../Context/AppContext'
//import { AppContext } from '../../HomePage/HomePage'
import { v4 } from 'uuid'
import ImagesList from './ImagesList/ImagesList';
import EmojiButton from './EmojiButton/EmojiButton';
import SendButton from './SendButton/SendButton';
import { fileToBlob } from '../../../utils/fileToBlob'
import ImageUploadButton from './ImageUploadButton/ImageUploadButton';
import classes from '../chat.module.scss'


const ChatInput = ({ chatId }) => {

	const { socket } = useContext(AppContext)

	const _id = useSelector(state => state.auth._id)
	const nickname = useSelector(state => state.auth.nickname)
	const text = useInput('')
	const [images, setImages] = useState([])
	const [stream, setStream] = useState(null)
	const [mediaRecorder, setMediaRecorder] = useState(null)
	const [isRecording, setIsRecording] = useState(false)

	const imagesInputRef = useRef(null)


	const sendMessage = (voiceMessage = null) => {
		if (voiceMessage || text.value.trim() !== "" || images.length > 0) {
			const newMessageId = v4()

			const newMessage = {
				messageId: newMessageId,
				senderId: _id,
				senderNickname: nickname,
				text: text.value,
				createdAt: Date.now(),
				status: 'sending',
				images: images,
				voiceMessage: voiceMessage
			}

			socket.emit('chatRoom:sendMessage', { newMessage, chatId })
			text.setValue('')
			setImages([])
			imagesInputRef.current.value = ""
		}
	}


	const onRecord = async () => {
		try {

			let stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			let recorder = new MediaRecorder(stream)
			setMediaRecorder(recorder)
			setStream(stream)

			recorder.onstart = () => {
				setIsRecording(true)
			}

			recorder.onstop = () => {
				setIsRecording(false)
			}

			recorder.ondataavailable = async (e) => {
				if (recorder.state === 'inactive') {
					const blob = await fileToBlob(e.data)
					sendMessage(blob)
				}
			}

			recorder.start()
		} catch (e) {
			console.warn(e)
		}
	}


	const stopRecording = () => {
		mediaRecorder.stop()
		if (stream) {
			stream.getTracks().forEach(track => {
				track.stop()
			})
		}

		setStream(null)
	}


	const enterHandler = event => {
		if (event.shiftKey && event.key === 'Enter') {
			event.preventDefault()
			text.setValue(previous => previous + '\r\n')
			return
		}
		if (event.key === 'Enter') {
			event.preventDefault()
			sendMessage()
		}
	}


	const uploadImage = async event => {
		if (event.target.files && event.target.files[0] && images.length <= 10) {
			const img = event.target.files[0]
			if (img.size < 750000) {
				const blob = await fileToBlob(img)
				setImages(prev => [...prev, blob])
			}
		}
	}


	const removeImage = useCallback((removingImg) => {
		setImages(prev => prev.filter(img => img !== removingImg))
		imagesInputRef.current.value = ""
	}, [])


	const addEmoji = useCallback((emoji) => {
		text.setValue(prev => prev + emoji)
	}, [])


	return (
		<div className={classes.footerSideWrapper}>

			{images && images.length > 0 && (
				<ImagesList
					images={images}
					removeImage={removeImage}
				/>
			)}

			<div className={classes.inputWrapper}>

				<InputBase
					className={classes.input}
					multiline
					maxRows={3}
					placeholder='Type your message here...'
					autoFocus
					value={text.value}
					onChange={text.onChange}
					onKeyDown={enterHandler}
					disabled={isRecording}
				/>

				<EmojiButton
					addEmoji={addEmoji}
				/>

				<ImageUploadButton
					uploadImage={uploadImage}
					imagesInputRef={imagesInputRef}
				/>

				<SendButton
					sendMessage={sendMessage}
					onRecord={onRecord}
					isRecording={isRecording}
					inputValue={text.value}
					stopRecording={stopRecording}
					numberOfImages={images.length}
				/>

			</div>

		</div>
	)
}

export default ChatInput