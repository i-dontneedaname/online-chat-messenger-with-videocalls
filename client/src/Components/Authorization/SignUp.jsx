import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { register } from '../../store/actions/auth';
import { useInput } from '../../hooks/useInput';
import { fileToBlob } from '../../utils/fileToBlob'
import Loader from '../UI/Loader/Loader';
import SetupAvatar from '../UI/SetupAvatar/SetupAvatar';
import classes from './auth.module.scss'
import { baseUrl } from '../../constants/constants';




const SignUp = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const isLoading = useSelector(state => state.auth.isLoading)

	const email = useInput('')
	const password = useInput('')
	const nickname = useInput('')
	const [uploadedAvatar, setUploadedAvatar] = useState(null)

	const goBack = () => {
		navigate(`${baseUrl}/signin`)
	}

	const submitHandler = event => {
		event.preventDefault()
	}

	const resetAvatar = () => {
		setUploadedAvatar(null)
	}

	const avatarChangeHandler = async event => {
		if (event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			if (img.size < 750000) {
				const blob = await fileToBlob(img)
				setUploadedAvatar(blob)
			}
		}
	}

	const submitRegistration = () => {
		if (nickname.value.trim() === "") return

		dispatch(register({
			email: email.value,
			password: password.value,
			nickname: nickname.value,
			avatar: uploadedAvatar
		}))
	}


	return !isLoading ? (
		<>

			<IconButton
				onClick={goBack}
				className={classes.back}
			>
				<ArrowBackIcon />
			</IconButton>

			<SetupAvatar
				uploadedAvatar={uploadedAvatar}
				avatarChangeHandler={avatarChangeHandler}
				resetAvatar={resetAvatar}
			/>

			<p className={classes.title}>
				Sign up
			</p>

			<form
				className={classes.form}
				onSubmit={submitHandler}
			>

				<TextField
					margin="normal"
					required
					fullWidth
					name="email"
					label="Email Address"
					id="email"
					autoFocus
					value={email.value}
					onChange={email.onChange}
					error={email.value === "".trim()}
					helperText={email.value === "".trim() && 'Empty!'}
				/>

				<TextField
					margin="normal"
					required
					fullWidth
					name="nickname"
					label="Nickname"
					id="nickname"
					value={nickname.value}
					onChange={nickname.onChange}
					error={nickname.value === "".trim()}
					helperText={nickname.value === "".trim() && 'Empty!'}
				/>

				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					value={password.value}
					onChange={password.onChange}
					error={password.value === "".trim()}
					helperText={password.value === "".trim() && 'Empty!'}
				/>

				<Button
					className={classes.button}
					fullWidth
					variant="contained"
					onClick={submitRegistration}
					disabled={nickname.value.trim() === "" || password.value === "".trim() || email.value === "".trim()}
				>
					Sign Up
				</Button>

			</form>

		</>
	) : (
		<Loader />
	)
}

export default SignUp