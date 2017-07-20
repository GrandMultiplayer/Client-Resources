var MAX_OVERALL_MESSAGES = 100;
var MAX_STORED_INPUTS = 10;
var INPUT_VISIBLE = false;
var STORED_INPUT_COUNT = 0;

var example = {
	size: 0, 				// -5 to 5
	maxmessages: 10,		// 5 to 50
	font: "Roboto",			// String, has fallback if invalid
};

var chat;
var lastInputs = [];
lastInputs.length = MAX_STORED_INPUTS;

function CEF_ReceiveMessageFromServer(message) {
	ShowChatMessage(message)
}

function SetFontSize(size) {
	if(size >= -5 && size <= 5) {
		chat.size = size;
		
		$("#chat-history").css("font-size", (20 + chat.size) + "px");
		$("#chat-history").css("line-height", (20 + chat.size) + "px");
		$("#chat-input-message").css("font-size", (20 + chat.size) + "px");
		$("#chat-history").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
		$("#chat-history ul").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
		$("#chat-container").css("height", ((chat.maxmessages * (24 + chat.size)) + $("#input-chat-message").height()) + "px");
	
		UpdateHistory();
		return chat.size;
	} else {
		return "Size must be between -5 and 5.";
	}
}

function SetMaxMessages(maxmsgs) {
	if(maxmsgs >= 5 && maxmsgs <= 50) {
		chat.maxmessages = maxmsgs;
		
		$("#chat-history").css("font-size", (20 + chat.size) + "px");
		$("#chat-history").css("line-height", (20 + chat.size) + "px");
		$("#chat-input-message").css("font-size", (20 + chat.size) + "px");
		$("#chat-history").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
		$("#chat-history ul").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
		$("#chat-container").css("height", ((chat.maxmessages * (24 + chat.size)) + $("#input-chat-message").height()) + "px");
		
		UpdateHistory();
		return chat.maxmessages;
	} else {
		return "Amount must be between 5 and 50.";
	}
}

function SetFont(font) {
	if(typeof font != 'string') return "Font must be a string.";
	chat.font = font;
	
	$("#chat-history").css("font-family", "'" + chat.font + "', 'Roboto', sans-serif");
	$("#input-chat-message").css("font-family", "'" + chat.font + "', 'Roboto', sans-serif");
	
	UpdateHistory();
	return font;
}

function ShowInput(should = true) {
	INPUT_VISIBLE = should;
	STORED_INPUT_COUNT = 0;
	if(should) {
		$("#chat-input").show();
		$("#chat-input-message").css("background-color", "rgba(0,0,0,0.4)");
		$("#chat-input-message").focus();
		$("#chat-history").css("overflow", "auto");
		//$("#chat-container").css("background-color", "rgba(0,0,0,0.4)");
		
		GrandM.ShowCursor(true);
	} else {
		$("#chat-input").hide();
		$("#chat-input-message").css("background-color", "rgba(0,0,0,0)");
		$("#chat-history").css("overflow", "hidden");
		//$("#chat-container").css("background-color", "rgba(0,0,0,0)");
		
		GrandM.ShowCursor(false);
	}
	UpdateHistory();
	return true;
}

function SendChatMessage() {
	//var message = $("#chat-input-message").val();
	var message = $($.parseHTML($("#chat-input-message").val())).text(); // Don't allow players to input html.
	if (message.length <= 0) return ShowInput(false);
	$("#chat-input-message").val("");
	ShowInput(false);
	lastInputs.unshift(message);
	if(lastInputs.length > MAX_STORED_INPUTS) lastInputs.length = MAX_STORED_INPUTS;
	return GrandM.CEFSendChatMessage(message);
}

function ShowChatMessage(message) {
	$("#chat-history ul").append("<li>" + "<span dir='auto' class='chat-msg'>" + message + "</span></li>"); // Servers can still use HTML.
	UpdateHistory()
	return message;
}

function InitializeChat(data) {
	chat = data;
	$("#chat-history").css("font-family", "'" + chat.font + "', 'Roboto', sans-serif");
	$("#input-chat-message").css("font-family", "'" + chat.font + "', 'Roboto', sans-serif");
	$("#chat-history").css("font-size", (20 + chat.size) + "px");
	$("#chat-history").css("line-height", (20 + chat.size) + "px");
	$("#chat-input-message").css("font-size", (20 + chat.size) + "px");
	$("#chat-history").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
	$("#chat-history ul").css("height", (chat.maxmessages * (24 + chat.size)) + "px");
	$("#chat-container").css("height", ((chat.maxmessages * (24 + chat.size)) + $("#input-chat-message").height()) + "px");
	
	//ShowChatMessage("<font color='#4286f4'>Welcome to Grand Multiplayer.</font>");
	
	ShowInput(false);
	UpdateHistory();
}

function UpdateHistory() {
	$("#chat-history").scrollTop($("#chat-history")[0].scrollHeight);
	if($("#chat-history li").length > MAX_OVERALL_MESSAGES) {
		$("#chat-history li").first().remove();
	}
}

// (jQuery) Document Ready
$(function() {
	InitializeChat(example);
	
	$("#chat-input-message").keyup(function(event) {
		if(event.keyCode == 13) { // Enter key
			SendChatMessage();
		} else if(event.keyCode == 38) { // Up arrow
			if(lastInputs[STORED_INPUT_COUNT] === undefined || lastInputs[STORED_INPUT_COUNT] === null) return false;
			$("#chat-input-message").val(lastInputs[STORED_INPUT_COUNT]);
			STORED_INPUT_COUNT++;
		} else if(event.keyCode == 40) { // Down arrow
			if(lastInputs[STORED_INPUT_COUNT-1] === undefined || lastInputs[STORED_INPUT_COUNT-2] === null) return false;
			$("#chat-input-message").val(lastInputs[STORED_INPUT_COUNT-2]);
			STORED_INPUT_COUNT--;
		}
	});
	
	$(document).keyup(function(event) {
		if(event.keyCode == 27 && INPUT_VISIBLE) { // Escape key
			ShowInput(false);
		} else if(event.keyCode == 33 && INPUT_VISIBLE) { // Page up
			$("#chat-history").scrollTop($("#chat-history").scrollTop()-$("#chat-history").height());
		} else if(event.keyCode == 34 && INPUT_VISIBLE) { // Page down
			$("#chat-history").scrollTop($("#chat-history").scrollTop()+$("#chat-history").height());
		}
	});
});