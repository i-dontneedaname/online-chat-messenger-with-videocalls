export const fileToBlob = file => {
	if (file) {
		return new Promise((resolve, _) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				resolve(reader.result)
			}
			reader.readAsDataURL(file)
		})
	}
}