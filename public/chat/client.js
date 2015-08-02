var socket = io.connect('http://localhost:3000/my-namespace');
var messages = [];

function sendMessage(){
	socket.emit('chat message', {
		token: $('#chatToken').val(),
		conversationId: $('#chatConversationId').val(),
		userId: socket.id,
		messageBody: $('#chatMessage').val()
	});
	$('#chatMessage').val('');
	return false;
}

function chatWith(userId){
	socket.emit('chat with user', {
		id: userId
	});
	return false;
}

socket.on('chat message', function(msg){
	messages[msg["room"]] = messages[msg["room"]] || [];
	messages[msg["room"]].push(msg["messageBody"]);
	if ($('#chatConversationId').val() != msg["room"]) {
		$('#chatMessagesBoard').html("");
		$('#chatConversationId').val(msg["room"]);
		messagesForCurrentRoom = messages[msg["room"]];
		for(var messageKey in messagesForCurrentRoom) {
			$('#chatMessagesBoard').append($('<li>').text(messagesForCurrentRoom[messageKey]));
		}
	} else {
		$('#chatMessagesBoard').append($('<li>').text(msg["messageBody"]));
	}
});

socket.on('chat users', function(clients){
	$('#chatUsersBoard').html($('<tr>').html($('<th>').text('Users')));
	for(var key in clients) {
		if(clients[key]["id"] !== socket["id"]) {
			$('#chatUsersBoard').append($('<tr>').append($("<td onclick='chatWith(\"" + clients[key]["id"].trim() + "\");'>").text(clients[key]["username"])));
		}
	}
});

socket.on('open chat', function(msg){
	$('#chatConversationId').val(msg["room"]);
	$('#chatMessagesBoard').html("");
	messagesForCurrentRoom = messages[msg["room"]];
	for(var messageKey in messagesForCurrentRoom) {
		$('#chatMessagesBoard').append($('<li>').text(messagesForCurrentRoom[messageKey]));
	}
	$('#chatUser').text("Chatting room " + msg["room"]).show();
	$('#chatMessage').show();
	$('#sendMessage').show();
});

$(document).ready(function() {
	socket.emit('add user', {
		username: $('#chatUsername').text() //Math.floor((Math.random() * 100000) + 1)
	});

	socket.emit('get users', {});
});