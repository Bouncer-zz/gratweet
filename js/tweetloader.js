$(document).ready(function() {
	$('#query').tweet({
		modpath: 'http://vu.bouncer.nl/twitter/',
		avatar_size: 32,
		count: 50,
		query: "-sex -#sexdating -buttpug -cockring -milf -geil -geile -erotisch -erotische gratis lang:nl include:retweets",
		refresh_interval: 10,
		loading_text: "searching twitter..."
	});
});
setInterval(function(){ 
	processText();
}, 5000);