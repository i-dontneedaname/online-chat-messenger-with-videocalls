import React, { useRef } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import classes from './setupAvatar.module.scss'
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';


const Input = styled('input')({
	display: 'none',
})

const SetupAvatar = (props) => {

	const {
		uploadedAvatar,
		resetAvatar,
		avatarChangeHandler
	} = props

	const imgInputRef = useRef()

	const handleResetInput = () => {
		resetAvatar()
		imgInputRef.current.value = ""
	}

	return (
		<div
			className={classes.wrapper}
		>

			<IconButton
				className={classes.reset}
				onClick={handleResetInput}
				aria-label="delete picture"
				component="span"
			>
				<CloseIcon />
			</IconButton>

			<Avatar
				sx={{
					margin: '10px',
					bgcolor: 'secondary.main',
					width: 88,
					height: 88,
				}}
				src={uploadedAvatar}
			>
				{!uploadedAvatar && (
					<LockOutlinedIcon sx={{ fontSize: 40 }} />
				)}
			</Avatar>

			<label htmlFor="icon-button-file">
				<Input
					accept="image/jpeg"
					id="icon-button-file"
					type="file"
					onChange={avatarChangeHandler}
					ref={imgInputRef}
				/>
				<IconButton
					className={classes.change}
					aria-label="upload picture"
					component="span"
				>
					<PhotoCamera />
				</IconButton>
			</label>
			
		</div>
	)
}

export default SetupAvatar