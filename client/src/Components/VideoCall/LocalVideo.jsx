import React from 'react';
import Loader from '../UI/Loader/Loader'
import classes from './call.module.scss'

const LocalVideo = (props) => {

	const {
		stream,
		localMediaStream
	} = props



	return (
		<div className={classes.local}>
			<video
				ref={localMediaStream}
				muted
				autoPlay
			/>

			{!stream && (
				<Loader />
			)}
		</div>
	)
}

export default LocalVideo