import React, { memo } from 'react';
import classes from '../../chat.module.scss'
import ImagesListItem from './ImagesListItem';

const ImagesList = props => {

	const {
		images,
		removeImage
	} = props

	return (
		<div className={classes.imageList}>
			{images.map(image => (
				<ImagesListItem
					key={image + Math.random()}
					image={image}
					removeImage={removeImage}
				/>

			))}
		</div>
	)
}

export default memo(ImagesList)