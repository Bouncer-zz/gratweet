var tweets = 15;
var refresh = tweets * 2000;

$(document).ready(function() {
	$('#data').tweet({
		modpath: 'http://vu.bouncer.nl/twitter/',
		avatar_size: 32,
		count: tweets,
		query: "-sex -sexdating -sexdate -buttpug -cockring -milf -geil -geile -erotisch -erotische gratis lang:nl include:retweets",
		refresh_interval: tweets * 2,
		loading_text: "searching twitter..."
	}).ready(function() {
		setInterval(function(){ 
			loadTweets();
		}, refresh);
		loadTweets();
	});
});

function loadTweets() {
	// select all new tweets
	var $data = $('#data ul li');
	var length = 0;
	$data.each(function(i, value) {
		var id = $(value).find(".tweet_time a").attr("href");
		if($('#query .tweet_list li .tweet_time a[href="'+id+'"]').length != 0) {
			delete $data[i];
		} else if($('#query .tweet_list li .tweet_time a[href="'+id+'"]').length == 0) {
			length++;
		}
	});

	$($data.get().reverse()).each(function(i, value) {
		if(i < length) {
			$(value).delay((refresh/(length))*(i)).show(1,function() {
				$(value).hide().prependTo($('#query .tweet_list')).show('slow');
				if(!(window.mozInnerScreenX == null)) {
					$(value).css("display", "inline-block");
				}
				processText();
				var location = $('#query .tweet_list li .location').html();
				
				if(location.length > 0) {
					// To add the marker to the map, use the 'map' property
					geocoder.geocode( { 'address': location}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							map.panTo(results[0].geometry.location);
							var marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location
							});
						}
					});
				}
			});
		}
	});
}
