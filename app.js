var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@127.0.0.1/messages', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

var models = require('./models/message')(app, mongoose);
var messageController = require('./controllers/messages');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();
router.route('/messages').get(messageController.findAllMessages);
app.use(router);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

