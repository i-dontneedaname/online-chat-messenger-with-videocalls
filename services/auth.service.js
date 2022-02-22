const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const config = require('config');

class AuthService {

	generateTokens(payload) {
		const accessToken = jwt.sign(payload, config.get('accessJWT'), { expiresIn: '45m' })
		const refreshToken = jwt.sign(payload, config.get('refreshJWT'), { expiresIn: '30d' })
		return {
			accessToken,
			refreshToken
		}
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({ owner: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save()
		}

		const token = await new Token({ owner: userId, refreshToken });
		await token.save()
		return token
	}

	async removeToken(refreshToken) {
		const tokenData = await Token.deleteOne({ refreshToken })
		return tokenData
	}

}


module.exports = new AuthService()