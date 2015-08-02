//File: controllers/messages.js
var mongoose = require('mongoose');

//GET - Return index
exports.showChat = function(req, res) {
	if(req.err) res.send(500).body(err.message);

	var textArray = [
		'Miguel',
		'Ferrete',
		'Jotas',
		'Jlo',
		'Marta',
		'María',
		'Martilla'
	];
	var randomNumber = Math.floor(Math.random()*textArray.length);
	var username = textArray[randomNumber]

	console.log('GET /index')
	res.render('index', {
		chatToken: "1",
		chatConversationId: "1",
		chatUserId: "1",
		username: username
	});

};

exports.provideStatic = function(req, res){
	var path = req.params[0] ? req.params[0] : 'index.html';
	res.sendFile(path, {root: './public'});
}