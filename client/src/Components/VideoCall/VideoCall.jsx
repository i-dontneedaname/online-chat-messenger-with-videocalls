import React from 'react';
import Button from '@mui/material/Button';
import CallEndIcon from '@mui/icons-material/CallEnd';
import LocalVideo from './LocalVideo';
import PartnerVideo from './PartnerVideo';
import classes from './call.module.scss'

const VideoCall = (props) => {

	const {
		callInfo: { partnerId },
		localMediaStream,
		isCallAccepted,
		userVideo,
		handleStopCall,
		rejectCall,
		stream
	} = props


	const stopCall = () => {
		handleStopCall(partnerId)
	}


	return (

		<>

			<LocalVideo
				stream={stream}
				localMediaStream={localMediaStream}
			/>

			<PartnerVideo
				isCallAccepted={isCallAccepted}
				userVideo={userVideo}
			/>

			<Button
				className={classes.endButton}
				onClick={isCallAccepted ? stopCall : rejectCall}
				variant="outlined"
			>
				<CallEndIcon />
			</Button>

		</>
	)
}

export default VideoCall