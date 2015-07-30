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
