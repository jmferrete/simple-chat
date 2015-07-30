//File: controllers/messages.js
var mongoose = require('mongoose');
var Message  = mongoose.model('Message');

//GET - Return all messages in the DB
exports.findAllMessages = function(req, res) {
	Message.find(function(err, messages) {
		if(err) res.send(500).body(err.message);

		console.log('GET /messages')
		res.status(200).jsonp(messages);
	});
};

//POST - Create a message
exports.createMessage = function(req, res) {
	var message = new Message({
		conversationId: req.body.conversationId,
		userId: req.body.userId,
		messageBody: req.body.messageBody
	});

	message.save(function(err){
		if(!err){
			console.log("Created");
		} else {
			console.log("ERROR: " + err);
		}
	});

	console.log('POST /message');
	res.status(200).jsonp(message);
};

