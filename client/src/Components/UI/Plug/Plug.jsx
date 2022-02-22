import React from 'react';
import classes from './plug.module.scss'

const Plug = (props) => {

	const {
		children
	} = props

	return (
		<p className={classes.plug}>
			{children}
		</p>
	)
}

export default Plug