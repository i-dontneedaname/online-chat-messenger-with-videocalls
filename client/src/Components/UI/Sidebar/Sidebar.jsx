import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import { useBreakpoints } from '../../../hooks/useBreakpoints';


const Sidebar = (props) => {

	const {
		anchor,
		open,
		handleClose,
		handleOpen,
		children
	} = props

	const { sm } = useBreakpoints()


	return (
		<SwipeableDrawer
			anchor={anchor}
			open={open}
			onOpen={handleOpen}
			onClose={handleClose}
			keepMounted
			PaperProps={{
				style: sm ? (
					{ width: '300px' }
				) : (
					{ width: '100%' }
				)
			}}
		>
			{anchor === 'left' ? (
				<IconButton
					onClick={handleClose}
					sx={{
						position: 'absolute',
						borderRadius: '5px',
						padding: '4px',
						color: '#000000',
						right: '4px',
						top: '6px'
					}}
				>
					<SwipeLeftIcon />
				</IconButton>
			) : (
				<IconButton
					onClick={handleClose}
					sx={{
						position: 'absolute',
						borderRadius: '5px',
						padding: '4px',
						color: '#000000',
						left: '4px',
						top: '6px'
					}}
				>
					<SwipeRightIcon />
				</IconButton>
			)}

			{children}
		</SwipeableDrawer >
	)
}

export default Sidebar