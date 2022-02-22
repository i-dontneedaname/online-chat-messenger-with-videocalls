export const formatDuration = (value) => {
	const minutes = Math.floor(value / 60)
	const seconds = Math.round(value - minutes * 60)
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}