import React from 'react';
import { useVideoCall } from '../../hooks/useVideoCall';
import VideoCallNotification from './VideoCallNotification';
import VideoCall from './VideoCall';
import classes from './call.module.scss'


const VideoCallWrapper = () => {

	const {
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
	} = useVideoCall()


	return (
		<>
			{Boolean(Object.keys(callInfo).length > 0) && (
				<div className={classes.wrapper}>
					<div className={classes.videoContainer}>
						{isCallStarted && (
							<VideoCall
								callInfo={callInfo}
								localMediaStream={localMediaStream}
								isCallAccepted={isCallAccepted}
								userVideo={userVideo}
								handleStopCall={handleStopCall}
								rejectCall={rejectCall}
								stream={stream}
							/>
						)}

						{
							isReceived === true && !isCallStarted && (
								<VideoCallNotification
									callInfo={callInfo}
									acceptCall={acceptCall}
									rejectCall={rejectCall}
								/>
							)
						}
					</div>
				</div>
			)}
		</>
	)
}

export default VideoCallWrapper