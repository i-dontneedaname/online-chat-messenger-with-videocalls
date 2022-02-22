import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AuthRoutes from '../../routes/AuthRoutes';
import classes from './auth.module.scss'

const Authorization = () => {

	return (

		<Grid container
			columns={18}
			component="div"
			className={classes.container}
		>

			<Grid item
				xs={false}
				sm={6}
				md={13}
				className={classes.imgWrapper}
			/>

			<Grid item
				xs={18}
				sm={12}
				md={5}
				component={Paper}
				elevation={6}
				square
				className={classes.contentWrapper}
			>

				<AuthRoutes />

			</Grid>

		</Grid>

	)
}

export default Authorization