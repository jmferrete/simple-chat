var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var messageSchema = new Schema({
  conversationId:   { type: String },
  userId:    { type: String },
  dateTime:     { type: Date, default: Date.now },
  messageBody:  { type: String }
});

module.exports = mongoose.model('Message', messageSchema);
