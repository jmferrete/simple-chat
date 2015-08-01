//File: controllers/messages.js
var mongoose = require('mongoose');

//GET - Return index
exports.showChat = function(req, res) {
	if(req.err) res.send(500).body(err.message);

	console.log('GET /index')
	res.render('index', {
		chatToken: "1",
		chatConversationId: "1",
		chatUserId: "1"
	});
};

