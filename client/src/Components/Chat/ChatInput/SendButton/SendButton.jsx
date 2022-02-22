import React from 'react';
import Button from '@mui/material/Button';
import TelegramIcon from '@mui/icons-material/Telegram';
import MicIcon from '@mui/icons-material/Mic';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import classes from '../../chat.module.scss'



const SendButton = (props) => {

	const {
		sendMessage,
		inputValue,
		onRecord,
		isRecording,
		stopRecording,
		numberOfImages
	} = props


	return inputValue || numberOfImages > 0 ? (
		<Button
			className={classes.sendButton}
			sx={{ paddingLeft: '12px', }}
			color="primary"
			variant="contained"
			onClick={() => sendMessage()}
			disabled={isRecording}
		>
			<TelegramIcon sx={{ fontSize: '28px' }} />
		</Button>
	) : !isRecording ? (
		<Button
			className={classes.sendButton}
			sx={{ paddingLeft: '16px', }}
			color="primary"
			variant="contained"
			onClick={onRecord}
			disabled={isRecording}
		>
			<MicIcon sx={{ fontSize: '28px' }} />
		</Button>
	) : (
		<Button
			className={classes.sendButton}
			sx={{ paddingLeft: '16px', }}
			color="primary"
			variant="contained"
			onClick={stopRecording}
		>
			<RadioButtonCheckedIcon sx={{ fontSize: '28px' }} />
		</Button>
	)
}

export default SendButton