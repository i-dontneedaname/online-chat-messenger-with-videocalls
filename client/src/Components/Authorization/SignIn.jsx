import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { login } from '../../store/actions/auth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import { useInput } from '../../hooks/useInput';
import Loader from '../UI/Loader/Loader';
import classes from './auth.module.scss'

const SignIn = () => {

	const dispatch = useDispatch()

	const isLoading = useSelector(state => state.auth.isLoading)

	const email = useInput('')
	const password = useInput('')


	const submitHandler = event => {
		event.preventDefault()
	}


	const submitLogin = () => {
		dispatch(login({
			email: email.value,
			password: password.value
		}))
	}


	return !isLoading ? (
		<>

			<Avatar
				sx={{
					m: 1,
					bgcolor: 'secondary.main',
					width: 88,
					height: 88
				}}
			>
				<LockOutlinedIcon sx={{ fontSize: 40 }} />
			</Avatar>

			<p className={classes.title}>
				Sign in
			</p>

			<form
				className={classes.form}
				onSubmit={submitHandler}
			>

				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					value={email.value}
					onChange={email.onChange}
					autoFocus
					error={email.value === "".trim()}
					helperText={email.value === "".trim() && 'Empty!'}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					value={password.value}
					onChange={password.onChange}
					id="password"
					error={password.value === "".trim()}
					helperText={password.value === "".trim() && 'Empty!'}
				/>

				<Button
					className={classes.button}
					fullWidth
					variant="contained"
					onClick={submitLogin}
				>
					Sign In
				</Button>

				<Link
					className={classes.link}
					to={'/signup'}
				>
					Don't have an account? Sign Up
				</Link>

			</form>

		</>
	) : (
		<Loader />
	)
}

export default SignIn