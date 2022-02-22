import React from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import classes from '../../chat.module.scss'


const Input = styled('input')({
	display: 'none',
})

const ImageUploadButton = props => {

	const {
		uploadImage,
		imagesInputRef
	} = props


	return (
		<label htmlFor="chat-input-img">
			<Input
				accept="image/jpeg"
				id="chat-input-img"
				type="file"
				onChange={uploadImage}
				ref={imagesInputRef}
			/>
			<IconButton
				className={classes.imgUploadButton}
				aria-label="upload image"
				component="span"
			>
				<PhotoCameraIcon />
			</IconButton>
		</label>
	)
}

export default ImageUploadButton