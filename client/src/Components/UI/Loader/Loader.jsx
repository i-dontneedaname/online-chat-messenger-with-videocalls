import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import classes from './loader.module.scss'

const Loader = () => {
	return (
		<div className={classes.loaderWrapper}>
			<div className={classes.loader}>
				<CircularProgress color="primary" />
			</div>
		</div>
	)
}

export default Loader