const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {

		const accessToken = req.headers.authorization.split(' ')[1];

		if (!accessToken) {
			return res.status(401).json({message: 'User is non authorized'});
		}

		const userData = jwt.verify(accessToken, config.get('accessJWT'));
		req.user = userData;
		next();

	} catch (e) {
		return res.status(401).json ({message: 'User is non authorized'});
	}

}