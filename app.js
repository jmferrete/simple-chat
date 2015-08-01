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
            //console.log("Username", connectedClients[key].username);
            users.push({id:connectedClients[key].id,username:connectedClients[key].username});
        }
        console.log(users);
        io.emit('chat users', users);
    });

    socket.on('add user', function(user){
        socket.username = user.username;
    });

    socket.on('chat with user', function(user){
        console.log("User ->", user);
        var room = socket.id + user.id
        socket.join(room);
        var theOtherSocket = io.connected[user.id];
        theOtherSocket.join(room);
        io.emit('open chat', {username: theOtherSocket.username});
        socket.broadcast.to(user.id).emit('open chat', {username: socket.username});
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg.messageBody);
    });
});

app.get('/index', chatController.showChat);
app.get('/messages', messageController.findAllMessages);
app.post('/message', messageController.createMessage);

http.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

