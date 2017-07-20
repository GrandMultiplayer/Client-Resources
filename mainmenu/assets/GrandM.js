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
		
		for (i = 0; i < data.servers.length; i++) {
			servers += '<tr><td>' + data.servers[i].Name + '</td><td>' + data.servers[i].GameType + '</td><td class="right aligned" style="padding:0;">' + data.servers[i].Players + '</td><td width="50%" style="padding:0;">/' + data.servers[i].MaxPlayers + '</td><td class="right aligned"><p><button class="ui button" onclick="GandM.Connect("' + data.servers[i].IPAddress + '", ' + data.servers[i].Port + ')">Join</button></p></td></tr>'
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
	
	document.getElementById("GMServersButton").onclick = function() { hideServers(); }
}

function hideServers(){
	var myElement = document.getElementById('GMServers');
	myElement.style.display = 'none';
	myElement.onclick = function() { showServers(); }
	
	document.getElementById("GMServersButton").onclick = function() { showServers(); }
}

function showOptions(){
	// get a reference to your element, or it's container
	var myElement = document.getElementById('GMOptions');
	myElement.style.display = '';
	hideServers();
	
	document.getElementById("GMOptionsButton").onclick = function() { hideOptions(); }
}

function hideOptions(){
	var myElement = document.getElementById('GMOptions');
	myElement.style.display = 'none';
	
	document.getElementById("GMOptionsButton").onclick = function() { showOptions(); }
}

function updateOption(element, option)
{
	GrandM.SetOption(option, element.value())
}