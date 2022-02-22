import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';

const MessageStatus = ({ status }) => {

	return status === 'sent' ? (
		<DoneIcon sx={{ fontSize: '1rem' }} />
	) : status === 'sending' ? (
		<AccessTimeIcon sx={{ fontSize: '1rem' }} />
	) : status === 'read' ? (
		<DoneAllIcon  sx={{ fontSize: '1rem' }} />
	) : (
		null
	)

}

export default MessageStatus