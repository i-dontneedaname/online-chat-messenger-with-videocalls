export const decodeEmoji = (code) => {
	if (code) {
		let sym = code.split(' ')
		let codesArray = sym.map(item => ('0x' + item.slice(2)))
		let result = String.fromCodePoint(...codesArray)
		return result
	}
}