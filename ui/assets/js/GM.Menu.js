var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}

function minmax(value, min, max)  {
    if(parseInt(value) < min || isNaN(parseInt(value))) 
        return min; 
    else if(parseInt(value) > max) 
        return max; 
    else return value;
}

function RefeshServers() {
	getJSON('https://api.grand-multiplayer.com/gmmasterlist/',
	function(err, data) {
	  if (err != null) {
		alert('Something went wrong: ' + err);
	  } else {
		//alert('Total Servers: ' + data.total);
		var servers = '';
		
		document.getElementById("totals").innerHTML = data.total + " Servers";
		
		var fwidth = document.getElementById("fav").offsetWidth;
		var nwidth = document.getElementById("name").offsetWidth;
		var gwidth = document.getElementById("gamemode").offsetWidth;
		var pwidth = document.getElementById("players").offsetWidth;
		var mwidth = document.getElementById("ping").offsetWidth;
		
		$("#gmServerList").empty();
		
		for (i = 0; i < data.servers.length; i++) {
			$("#gmServerList").append('<tr data-ip="' + data.servers[i].IPAddress + '" data-port="' + data.servers[i].Port + '" style="display: table; width: 100%"><td width="'+ fwidth + '"><i class="star icon disabled"></i></td><td width="'+ nwidth + '">' + data.servers[i].Name + '</td><td width="'+ gwidth + '">' + data.servers[i].Gamemode + '</td><td width="'+ pwidth + '" sorttable_customkey="' + data.servers[i].Players + '">' + data.servers[i].Players + ' / ' + data.servers[i].MaxPlayers + '</td><td width="'+ mwidth + '" class="right aligned"><p>999ms</p></td></tr>')
		}
		
		$('tr').dblclick(function () {
			var ip = $(this).data("ip");
			var port = $(this).data("port");
			
			GrandM.Connect(ip, port);
		});
		
		 $('tr').click(function () {
			//Check to see if background color is set or if it's set to white.
			if(this.style.background == "") {
				if(selectedRow) {
					$(selectedRow).css('background-color', '');
				}
				
				selectedRow = this;
				$(this).css('background-color', 'rgba(32, 132, 207, 0.5)');
				
				var Button = document.getElementById("GMConnect");
				Button.classList.remove("disabled");
			}
		});
		
	  }
	});
}

function serverSearch() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("serverSearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("gmServerList");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
	td = tr[i].getElementsByTagName("td")[0];
	if (td) {
	  if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
		tr[i].style.display = "";
	  } else {
		tr[i].style.display = "none";
	  }
	}
	
	td = tr[i].getElementsByTagName("td")[1];
	if (td) {
	  if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
		tr[i].style.display = "";
	  }
	}
  }
}

var selectedRow;
function DisplayServerList(state){
	if(state) {
		// get a reference to your element, or it's container
		var myElement = document.getElementById('GMServers');
		myElement.style.display = '';
		DisplayOptions(false);
		DisplayHome(false);
		
		RefeshServers();
		
		var Button = document.getElementById("GMServersButton");
		Button.classList.add("active");
		Button.onclick = function() { DisplayServerList(false); }
		
		GetOption(document.getElementById('SLplayerName'), "name") ;
	}
	else {
		var myElement = document.getElementById('GMServers');
		myElement.style.display = 'none';

		var Button = document.getElementById("GMServersButton");
		Button.classList.remove("active");
		Button.onclick = function() { DisplayServerList(true); }
	}
}

function DisplayOptions(state) {
	if(state) {
		// get a reference to your element, or it's container
		var myElement = document.getElementById('GMOptions');
		myElement.style.display = '';
		DisplayServerList(false);
		DisplayHome(false);
		
		var Button = document.getElementById("GMOptionsButton");
		Button.classList.add("active");
		Button.onclick = function() { DisplayOptions(false); }
		
		fetchOptions();
	}
	else {
		var myElement = document.getElementById('GMOptions');
		myElement.style.display = 'none';
		
		var Button = document.getElementById("GMOptionsButton");
		Button.classList.remove("active");
		Button.onclick = function() { DisplayOptions(true); }
	}
}

function DisplayHome(state) {
	if(state) {
		// get a reference to your element, or it's container
		var myElement = document.getElementById('GMHome');
		myElement.style.display = '';
		DisplayServerList(false);
		DisplayOptions(false);
		
		var Button = document.getElementById("GMHomeButton");
		Button.classList.add("active");
		Button.onclick = function() { DisplayHome(false); }
	}
	else {
		var myElement = document.getElementById('GMHome');
		myElement.style.display = 'none';
		
		var Button = document.getElementById("GMHomeButton");
		Button.classList.remove("active");
		Button.onclick = function() { DisplayHome(true); }
	}
}

function fetchOptions() {
	// Fetch Values from config
	GetOption(document.getElementById('o.nickname'), "name");
	GetOption(document.getElementById('o.address'), "ip");
	GetOption(document.getElementById('o.port'), "port");
	
	if(GrandM.GetOption("editor")) {
		$('.checkbox.oeditor').checkbox('set checked');
	}
	else {
		$('.checkbox.oeditor').checkbox('set unchecked');
	}
	
	if(GrandM.GetOption("debugui")) {
		$('.checkbox.odebugui').checkbox('set checked');
	}
	else {
		$('.checkbox.odebugui').checkbox('set unchecked');
	}
	
	if(GrandM.GetOption("debuglog")) {
		$d('.checkbox.odebuglog').checkbox('set checked');
	}
	else {
		$('.checkbox.odebuglog').checkbox('set unchecked');
	}
	
	if(GrandM.GetOption("chatvisible")) {
		$('.checkbox.ochatvisible').checkbox('set checked');
	}
	else {
		$('.checkbox.ochatvisible').checkbox('set unchecked');
	}
	
	$('.dropdown.ochatsize').dropdown('set selected', GrandM.GetOption("chatsize").toString());
	
	GetOption(document.getElementById('o.messagecount'), "chatmessagecount");
}

function SaveOptions() {
	GrandM.SetOption("name", document.getElementById('o.nickname').value);
	GrandM.SetOption("ip", document.getElementById('o.address').value);
	GrandM.SetOption("port", parseInt(document.getElementById('o.port').value));
	
	GrandM.SetOption("editor", $('.checkbox.oeditor').checkbox('is checked'));
	
	GrandM.SetOption("debugui", $('.checkbox.odebugui').checkbox('is checked'));
	
	GrandM.SetOption("debuglog", $('.checkbox.odebuglog').checkbox('is checked'));
	
	GrandM.SetOption("chatvisible", $('.checkbox.ochatvisible').checkbox('is checked'));
	
	GrandM.SetOption("chatsize", parseInt($('.dropdown.ochatsize').dropdown('get value')));
	
	GrandM.SetOption("chatmessagecount", parseInt(document.getElementById('o.messagecount').value));
	
	GrandM.SaveConfig();
}

function optionsTab(object, opentab) {
	if(!object.classList.contains("active")) {
		object.classList.add("active");
		
		if(opentab == 'o.profile') {
			var button = document.getElementById("bO.Settings");
			button.classList.remove("active");
			
			var element = document.getElementById(opentab);
			element.style.display = '';
			
			element = document.getElementById('o.settings');
			element.style.display = 'none';
		}
		else if(opentab == 'o.settings') {
			var button = document.getElementById("bO.Profile");
			button.classList.remove("active");
			
			var element = document.getElementById(opentab);
			element.style.display = '';
			
			element = document.getElementById('o.profile');
			element.style.display = 'none';
		}
	}
}

function GetOption(element, option)
{
	element.value = GrandM.GetOption(option);
}

function DisplayQuickConnect(state)
{
	if(state) {
		$('.mini.modal.quickconnect')
		.modal({
			blurring: true
		})
		.modal('show');	
		
		GetOption(document.getElementById('modal.address'), "ip") ;
		GetOption(document.getElementById('modal.port'), "port") ;
	}
	else {
		$('.mini.modal.quickconnect')
		.modal({
			blurring: true
		})
		.modal('hide');
	}
}

function DisplayConnectionError(state, type, reason)
{
	if(state) {
		document.getElementById('connectionerror.title').innerHTML = "<i class='server icon'></i>" + type;
		document.getElementById('connectionerror.text').innerHTML = reason;
		
		$('.tiny.modal.connection')
		.modal({
			blurring: true
		})
		.modal('show');
	}
	else {
		$('.tiny.modal.connection')
		.modal({
			blurring: true
		})
		.modal('hide');
	}
}

function DisplayLoadingScreen(state) {
	if(state) {
		DisplayQuickConnect(false);
		DisplayChat(false);
		DisplayMainMenu(false);
		
		var element = document.getElementById('GM.Loading');
		element.style.display = '';
		
		var list = document.getElementsByClassName('pg-loading-screen pg-loading');
		list[0].style.display = '';
	}
	else {
		var list = document.getElementsByClassName('pg-loading-screen pg-loading');
		list[0].style.display = 'none';
		
		var element = document.getElementById('GM.Loading');
		element.style.display = 'none';
	}
}

function DisplayChat(state) {
	if(state) {
		DisplayQuickConnect(false);
		DisplayLoadingScreen(false);
		DisplayMainMenu(false);
	
		var element = document.getElementById('GM.Chat');
		element.style.display = '';
	}
	else {
		var element = document.getElementById('GM.Chat');
		element.style.display = 'none';
	}
}

function DisplayMainMenu(state) {	
	if(state) {
		DisplayQuickConnect(false);
		DisplayChat(false);
		DisplayLoadingScreen(false);
		
		var element = document.getElementById('GM.Menu');
		element.style.display = '';
	}
	else {
		var element = document.getElementById('GM.Menu');
		element.style.display = 'none';
	}
}

function Quit() {
	return GrandM.Quit();
}

function setLoadingMessage(inText) {
	document.getElementById("loading-message").innerHTML = inText;
}