import React, { useContext } from 'react';
import Menu from '@mui/material/Menu';
//import { AppContext } from '../../../HomePage/HomePage';
import { AppContext } from '../../../../Context/AppContext'
import EmojiListItem from './EmojiListItem';
import classes from "../../chat.module.scss"

const EmojiList = props => {

	const {
		anchorEl,
		handleClose,
		addEmoji
	} = props

	const { emojiList } = useContext(AppContext)


	return (
		<Menu
			id="long-menu"
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleClose}
			PaperProps={{
				style: {
					maxHeight: '200px',
					width: '200px',
					padding: '5px '
				},
			}}
		>
			<div
				className={classes.emojiList}
			>
				{emojiList.length > 0 && emojiList.map(emoji => (
					<EmojiListItem
						emoji={emoji}
						addEmoji={addEmoji}
						key={emoji.no}
					/>
				))}
			</div>
		</Menu>
	)
}

export default EmojiList