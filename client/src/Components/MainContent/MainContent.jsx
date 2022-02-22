import React, { useState } from 'react';
import Users from '../Users/Users';
import ChatRoutes from '../../routes/ChatRoutes';
import ChatsList from '../ChatsList/ChatsList';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Sidebar from '../UI/Sidebar/Sidebar';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import classes from './content.module.scss'
import { useBreakpoints } from '../../hooks/useBreakpoints'


const MainContent = () => {

	const { sm, lg } = useBreakpoints()

	const [isUsersOpen, setIsUsersOpen] = useState(false)
	const [isChatListOpen, setIsChatListOpen] = useState(false)


	const handleOpenUsers = () => {
		setIsUsersOpen(true)
	}

	const handleCloseUsers = () => {
		setIsUsersOpen(false)
	}

	const handleOpenChatsList = () => {
		setIsChatListOpen(true)
	}

	const handleCloseChatsList = () => {
		setIsChatListOpen(false)
	}


	return (
		<Grid container
			className={classes.wrapper}
			component="main"
			columns={18}
		>

			{sm ? (
				<Grid item
					className={classes.scroll}
					component={Paper}
					elevation={1}
					sm={6}
					lg={4}
				>
					<ChatsList />
				</Grid>
			) : (
				<>
					<Sidebar
						anchor="left"
						open={isChatListOpen}
						handleClose={handleCloseChatsList}
						handleOpen={handleOpenChatsList}
					>
						<ChatsList
							handleCloseChatsList={handleCloseChatsList}
						/>
					</Sidebar>

					{!isChatListOpen && (
						<IconButton
							className={`${classes.button} ${classes.chatsClosed}`}
							onClick={handleOpenChatsList}
						>
							<SwipeRightIcon />
						</IconButton>
					)}
				</>
			)}


			<Grid item
				className={classes.nonScroll}
				xs={18}
				sm={12}
				lg={11}
			>
				<ChatRoutes />
			</Grid>


			{lg ? (
				<Grid item
					className={classes.scroll}
					component={Paper}
					elevation={1}
					lg={3}
				>
					<Users />
				</Grid>
			) : (
				<>
					<Sidebar
						anchor="right"
						open={isUsersOpen}
						handleClose={handleCloseUsers}
						handleOpen={handleOpenUsers}
					>
						<Users
							handleCloseUsers={handleCloseUsers}
						/>
					</Sidebar>


					{!isUsersOpen && (
						<IconButton
							className={`${classes.button} ${classes.usersClosed}`}
							onClick={handleOpenUsers}
						>
							<SwipeLeftIcon />
						</IconButton>
					)}
				</>
			)}
		</Grid>
	)
}

export default MainContent