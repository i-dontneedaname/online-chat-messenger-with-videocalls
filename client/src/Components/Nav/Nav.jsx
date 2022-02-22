import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavUserMenu from './NavUserMenu';
import classes from './nav.module.scss'


const Nav = () => {
	return (
		<AppBar
			elevation={1}
			position="static"
			className={classes.appbar}
		>
			<Toolbar
				className={classes.toolbar}
			>

				<Typography
					variant="h6"
					noWrap
					component="div"
					className={classes.logo}
				>
					LOGO
				</Typography>

				<NavUserMenu />

			</Toolbar>
		</AppBar>
	)
}

export default Nav