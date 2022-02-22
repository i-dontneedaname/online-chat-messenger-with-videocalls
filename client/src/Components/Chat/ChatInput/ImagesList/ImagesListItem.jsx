import React from 'react';
import Image from '../../../UI/Image/Image'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import classes from '../../chat.module.scss'

const ImagesListItem = props => {

	const {
		image,
		removeImage
	} = props

	const clickHandler = () => {
		removeImage(image)
	}

	return (
		<div
			className={classes.imageContainer}
		>
			<Image
				imgData={image}
			/>

			<IconButton
				className={classes.button}
				onClick={clickHandler}
			>
				<CloseIcon />
			</IconButton>
		</div>
	)
}

export default ImagesListItem