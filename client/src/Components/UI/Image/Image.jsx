import React from 'react';
import classes from './image.module.scss'

const Image = ({ imgData }) => {

	return (
		<div className={classes.image}>
			<img
				src={imgData}
				alt="aaa"
			/>
		</div>
	)
}

export default Image