const options = {
	day: "2-digit",
	month: "2-digit",
}

export const chatListTimestampConverter = (timestamp) => {

	let date = new Date(timestamp)
	let currentDate = new Date()

	if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
		return date.getMinutes().toString().length === 1 ?
			date.getHours() + ':0' + date.getMinutes()
			:
			date.getHours() + ':' + date.getMinutes()
	}

	//if (timestamp.)
	return date.toLocaleDateString('ru', options)

}

export const messageTimestampConverter = (timestamp) => {

	let date = new Date(timestamp)
	return date.getMinutes().toString().length === 1 ?
		date.getHours() + ':0' + date.getMinutes()
		:
		date.getHours() + ':' + date.getMinutes()
		
}




//new Date().toLocaleString('ru', options)