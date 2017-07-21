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

function RefeshServers()
{
	getJSON('https://api.grand-multiplayer.com/gmmasterlist/',
	function(err, data) {
	  if (err != null) {
		alert('Something went wrong: ' + err);
	  } else {
		//alert('Total Servers: ' + data.total);
		var servers = '';
		
		//var nameWidth = document.getElementById('serverName').offsetWidth;
		
		for (i = 0; i < data.servers.length; i++) {
			servers += '<tr style="display: table; width: 100%"><td style="width: 54%;">' + data.servers[i].Name + '</td><td style="width: 19%;">' + data.servers[i].GameType + '</td><td class="right aligned" style="padding:0;">' + data.servers[i].Players + '</td><td style="padding:0; width: 14%;">/' + data.servers[i].MaxPlayers + '</td><td class="right aligned"><p><button class="ui button" onclick="GandM.Connect("' + data.servers[i].IPAddress + '", ' + data.servers[i].Port + ')">Connect</button></p></td></tr>'
		}
		
		document.getElementById("gmServerList").innerHTML = servers;
	  }
	});
}

function serverSearch() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("serverSearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("GMSList");
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

function showServers(){
	// get a reference to your element, or it's container
	var myElement = document.getElementById('GMServers');
	myElement.style.display = '';
	hideOptions();
	hideHome();
	
	RefeshServers();
	
	var Button = document.getElementById("GMServersButton");
	Button.classList.add("active");
	Button.onclick = function() { hideServers(); }
}

function hideServers(){
	var myElement = document.getElementById('GMServers');
	myElement.style.display = 'none';
	myElement.onclick = function() { showServers(); }
	
	var Button = document.getElementById("GMServersButton");
	Button.classList.remove("active");
	Button.onclick = function() { showServers(); }
}

function showOptions(){
	// get a reference to your element, or it's container
	var myElement = document.getElementById('GMOptions');
	myElement.style.display = '';
	hideServers();
	hideHome();
	
	var Button = document.getElementById("GMOptionsButton");
	Button.classList.add("active");
	Button.onclick = function() { hideOptions(); }
}

function hideOptions(){
	var myElement = document.getElementById('GMOptions');
	myElement.style.display = 'none';
	
	var Button = document.getElementById("GMOptionsButton");
	Button.classList.remove("active");
	Button.onclick = function() { showOptions(); }
}

function showHome(){
	// get a reference to your element, or it's container
	var myElement = document.getElementById('GMHome');
	myElement.style.display = '';
	hideServers();
	hideOptions();
	
	var Button = document.getElementById("GMHomeButton");
	Button.classList.add("active");
	Button.onclick = function() { hideHome(); }
}

function hideHome(){
	var myElement = document.getElementById('GMHome');
	myElement.style.display = 'none';
	
	var Button = document.getElementById("GMHomeButton");
	Button.classList.remove("active");
	Button.onclick = function() { showHome(); }
}

function updateOption(element, option)
{
	GrandM.SetOption(option, element.value())
}