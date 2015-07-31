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

var router = express.Router();
router.route('/index').get(chatController.showChat);

router.route('/messages').get(messageController.findAllMessages);
router.route('/message').post(messageController.createMessage);

app.use(router);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

