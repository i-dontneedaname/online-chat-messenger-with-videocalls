import React from 'react';
import classes from '../../chat.module.scss'

const EmojiListItem = props => {

	const {
		emoji,
		addEmoji
	} = props

	const emojiClickHandler = () => {
		addEmoji(emoji.code)
	}


	return (
		<div className={classes.emojiWrapper}>
			<button
				className={classes.emoji}
				onClick={emojiClickHandler}
			>
				{emoji.code}
			</button>
		</div>
	)
}

export default EmojiListItem