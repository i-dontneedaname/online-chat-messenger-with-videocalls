

class UserService {

	blobToBase64Buffer(blob) {
		const base64 = blob.split(',')[1]
		return Buffer.from(base64, 'base64')
	}

	base64BufferToBlob(buffer, dataType) {
		if (buffer) {
			const base64 = buffer.toString('base64')
			return dataType + base64
		}

		return null
	}

}


module.exports = new UserService()