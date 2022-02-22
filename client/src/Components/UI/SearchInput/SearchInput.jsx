import React from 'react';
import InputBase from '@mui/material/InputBase';
import classes from "./search.module.scss"

const SearchInput = (props) => {

	const {
		value,
		onChange
	} = props

	return (
		<div
			className={classes.wrapper}
		>
			<InputBase
				className={classes.input}
				placeholder="Search..."
				value={value}
				onChange={onChange}
			/>
		</div>
	)
}

export default SearchInput