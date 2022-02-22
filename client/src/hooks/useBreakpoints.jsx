import { useTheme, useMediaQuery } from '@mui/material';

export const useBreakpoints = () => {

	const theme = useTheme()
	const lg = useMediaQuery(theme.breakpoints.up('lg'))
	const md = useMediaQuery(theme.breakpoints.up('md'))
	const sm = useMediaQuery(theme.breakpoints.up('sm'))
	const xs = useMediaQuery(theme.breakpoints.up('xs'))

	return {
		lg,
		md,
		sm,
		xs
	}
}