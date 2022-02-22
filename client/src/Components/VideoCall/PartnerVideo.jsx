import React from 'react';
import Loader from '../UI/Loader/Loader'
import classes from './call.module.scss'

const PartnerVideo = (props) => {

	const {
		isCallAccepted,
		userVideo
	} = props

	React.useEffect(() => {
		console.log(isCallAccepted)
	}, [isCallAccepted])

	return (
		<>
			<video
				ref={userVideo}
				className={classes.partner}
				autoPlay
			/>

			{!isCallAccepted && (
				<Loader />
			)}
		</>
	)
}

export default PartnerVideo