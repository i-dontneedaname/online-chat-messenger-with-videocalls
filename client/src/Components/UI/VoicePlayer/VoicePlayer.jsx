import React, { useState, useRef } from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleFilled from '@mui/icons-material/PlayCircleFilled';
import classes from './player.module.scss'
import { formatDuration } from '../../../utils/durationFormatter';

const VoicePlayer = (props) => {

	const {
		audioData
	} = props

	const [isPaused, setIsPaused] = useState(true)
	const [duration, setDuration] = useState(0)
	const [value, setValue] = useState(0)


	const ref = useRef()


	const changeTimelinePositionBySlider = event => {
		ref.current.currentTime = event.target.value
	}


	const changeTimelinePosition = event => {
		if (event.target.currentTime === event.target.duration) {
			setValue(0)
			setIsPaused(true)
		} else {
			setValue(event.target.currentTime)
		}
	}

	const getDuration = event => {
		event.target.currentTime = 0
		setDuration(event.target.duration)
		ref.current.removeEventListener('timeupdate', getDuration)
	}


	const onLoadedMetadata = event => {
		if (event.target.duration === Infinity) {
			ref.current.addEventListener('timeupdate', getDuration)
			ref.current.currentTime = 1e101
		} else {
			setDuration(event.target.duration)
		}
	}


	const toggleAudio = () => {
		if (isPaused) {
			ref.current.play()
			setIsPaused(false)
		} else {
			ref.current.pause()
			setIsPaused(true)
		}
	}


	return (
		<div className={classes.playerWrapper}>

			<IconButton
				className={classes.button}
				variant="contained"
				onClick={toggleAudio}
			>
				{isPaused ? (
					<PlayCircleFilled />
				) : (
					<PauseCircleIcon />
				)}
			</IconButton>

			<div className={classes.time}>
				{value === 0 ? formatDuration(duration) : formatDuration(value)}
			</div>

			<div className={classes.slider}>
				<Slider
					color="secondary"
					size="small"
					min={0}
					max={duration}
					step={0.1}
					value={value}
					onChange={changeTimelinePositionBySlider}
				/>
			</div>

			<audio
				ref={ref}
				onLoadedMetadata={onLoadedMetadata}
				onTimeUpdate={changeTimelinePosition}
				src={audioData}
			/>
		</div>
	)
}

export default VoicePlayer