var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
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
    io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log("User connected.");
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

app.get('/index', chatController.showChat);
app.get('/messages', messageController.findAllMessages);
app.post('/message', messageController.createMessage);

http.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

