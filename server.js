const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ["GET", "POST"]
	}
});
require('./consumer.js')(io)


const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const User = require('./models/User')

app.use(cors({
	origin: '*',
	credentials: true
}));
app.use(cookieParser());

app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/chats', require('./routes/chat.routes'));




const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}




const start = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://Ossikde:Speed3221337@conferencedb.q5jc7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
		server.listen(PORT, () => console.log(`Started on port ${PORT}...`))

	} catch (e) {
		console.log('Server Error', e.message)
		await User.updateMany({}, { socketId: null }, { new: true })
		process.exit(1)
	}
}

start();