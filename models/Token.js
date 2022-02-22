const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	owner: {type: Types.ObjectId, ref: 'User', required: true},
	refreshToken: {type: String, required: true}
})


module.exports = model('Token', schema);