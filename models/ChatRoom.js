const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
	//roomId: { type: String, required: true, unique: true },
	members: [{ type: Types.ObjectId, ref: 'User' }],
	messages: [{ type: Object }],
	lastMessage: { type: Object }
})


module.exports = model('ChatRoom', schema);