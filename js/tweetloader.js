var tweets = 5;
var refresh = tweets * 2000;
$(document).ready(function() {
	$('#data').tweet({
		modpath: 'http://vu.bouncer.nl/twitter/',
		avatar_size: 32,
		count: tweets,
		query: "-sex -#sexdating -buttpug -cockring -milf -geil -geile -erotisch -erotische gratis lang:nl include:retweets",
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
				processText();
			});
		}
	});
}