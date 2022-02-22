import React, { useState, memo } from 'react';
import classes from '../../chat.module.scss'
import EmojiList from './EmojiList'
import IconButton from '@mui/material/IconButton';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const EmojiButton = props => {

	const {
		addEmoji
	} = props

	const [anchorEl, setAnchorEl] = useState(null)


	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}


	return (
		<>
			<IconButton
				className={classes.emojiButton}
				onClick={handleClick}
			>
				<SentimentSatisfiedAltIcon />
			</IconButton>

			{Boolean(anchorEl) && (
				<EmojiList
					anchorEl={anchorEl}
					handleClose={handleClose}
					addEmoji={addEmoji}
				/>
			)}

		</>
	)
}

export default memo(EmojiButton)