var express = require("express"),
	app = express(),
	bodyParser  = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require('mongoose');

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@localhost/messages?authSource=admin', function(err, res) {
	if(err) throw err;
	console.log('Connected to Database');
});

var models = require('./models/message')(app, mongoose);
var messageController = require('./controllers/messages');
var chatController = require('./controllers/chat');

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var http = require('http').Server(app);
var io = require('socket.io')(http).of('/my-namespace');

io.on('connection', function(socket){
	console.log("User " + socket.id + " connected.");

	socket.on('get users', function(msg) {
		var connectedClients = io.connected;
		var users = [];
		for (var key in connectedClients) {
			users.push({id:connectedClients[key].id,username:connectedClients[key].username});
		}
		io.emit('chat users', users);
	});

	socket.on('add user', function(user){
		socket.username = user.username;
	});

	socket.on('chat with user', function(user){
		var room = socket.id + user.id;
		socket.join(room);
		var theOtherSocket = io.connected[user.id];
		if (theOtherSocket) {
			theOtherSocket.join(room);
			socket.emit('open chat', {room: room});
		}
	});

	socket.on('chat message', function(msg){
		var room = msg.conversationId;
		var me = (msg.userId === socket.id)
		io.to(room).emit('open chat', {room: room});
		io.to(room).emit('chat message', {messageBody: msg.messageBody, me: me, room: room});
	});
});

app.get('/index', chatController.showChat);
app.get('/public/*', chatController.provideStatic);
app.get('/messages', messageController.findAllMessages);
app.post('/message', messageController.createMessage);

http.listen(3000, function() {
	console.log("Node server running on http://localhost:3000");
});

