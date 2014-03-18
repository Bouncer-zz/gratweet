//maak variabelen aan voor text processing
var tweet_text = document.getElementsByClassName("tweet_text");
var tweet_text_raw = new Array();
var tokenised_tweets = new Array();
var tokenised_tweets_str = new Array();
var unique_tokenised_tweets_str = new Array();
var unique_tokenised_tweets = new Array();
var unique_tokens = new Array();
var tokens = new Array();//voor later
var tokens_histo = new Array();
var hashtags = new Array();
var ats = new Array();// an array to contain everything starting with @ (e.g. @vu_amsterdam, @home)
var stopwords = ["gratis","pic","bit","goo","iturl","aan", "afd", "als", "bij", "dat", "de", "den", "der", "des", "deze","die", "dit", "dl", "door", "dr", "ed", "een", "en","er", "enige", "enkele",
					"enz", "et", "etc", "haar", "het", "hierin", "hoe", "hun", "ik", "in", "inzake", "is", "je", "met", "na", "naar", "nabij", "niet", "no","nog", "nu", "of",
					"om", "onder", "ons", "onze", "ook", "oorspr", "op", "over", "pas", "pres", "prof", "publ", "sl", "st", "te", "tegen", "ten", "ter", "tot", "uit", "uitg",
					"vakgr", "van", "vanaf", "vert", "vol", "voor", "voortgez", "voortz", "wat", "wie", "zijn"];

function processText(){
		
	//haal de text uit de node objecten en stop ze in array
	for (i=0;i<tweet_text.length;i++)
	{
	  if (tweet_text.item(i).nodeType==1)
	  {
		tweet_text_raw.push(tweet_text.item(i).innerText);//innerHTML of andere methods kunnen ook hier
	  }
	}
	
	//functie om string op te splitsen
	function splitString(string, separator) {
		var arrayOfStrings = string.split(separator);
		tokenised_tweets.push(arrayOfStrings);
	}
	
	//tokenize elke tweet (op basis van een spatie)
	for (var i=0; i < tweet_text_raw.length; i++){
		splitString(tweet_text_raw[i], " ");
	};
	
	//haal hashtags uit de tweets
	//het is misschien leuk om met de hashtags een soort van 'now trending' te maken 
	//momenteel is de hashtag happyhour en minecraft trending bijv.
	for (var i=0; i < tokenised_tweets.length; i++){
		for (var j=0; j < tokenised_tweets[i].length; j++){
			var token = tokenised_tweets[i][j];
			var hashtag = token.match(/(#\w+)/g);
			var at = token.match(/(@\w+)/g);
			var url = token.match(/\w{2}[.]\w{2}/g); //door websites als google.nl kan de url regex niet specifieker dan dit worden
			var word = token.match(/([a-z,A-z]+)/g);
			
			//remove the hashtags and url's from the tokenised_tweets for further processing
			if(hashtag != null || url != null){delete tokenised_tweets[i][j];}
			
			//if match and not #gratis, then add to hashtags array 
			if(hashtag != null && hashtag[0].toLowerCase() !="#gratis"){
				hashtag = hashtag[0].substring(1);//haal de hashtag zelf weg voor string matchen en tellen later
				hashtags.push(hashtag);
			}
			
			//remove the @'s from the tokenised_tweets and add them to ats array for further processing
			if(at != null){
				at = at[0].substring(1);
				ats.push(at)
				delete tokenised_tweets[i][j];
			}
			
			//remove anything that isn't a word for further processing (woorden die eindigen met een ? . ! ofzo staan nog in tokenized_tweets, maar zijn bij tokens array eruit gehaald)
			if(word === null){
				delete tokenised_tweets[i][j];							
			}
			else{
			tokenised_tweets[i][j] = word[0];
			}
			
			var token = tokenised_tweets[i][j];//dit moet hier staan om een of andere reden... anders werk onderstaande niet
			
			if (typeof(token) != "undefined"){ //doordat ik delete gebruik blijven op sommige plekken (een hastag bijv.) undefined plekken over
				for (var k=0; k < stopwords.length; k++){
					
					//remove the stopwords from the tokenised_tweets for further processing
					if(token.toLowerCase() === stopwords[k]){//(stopword != null){
						delete tokenised_tweets[i][j];
					}							
				};
			
			}
		};				
	};	

	//make 2d array flat and ready for duplicate removal
	for (var i=0; i < tokenised_tweets.length; i++){
		tokenised_tweets_str.push(tokenised_tweets[i].toString());
	};
	
	//function to remove duplicates
	var noDuplicates = function(array) {
		var newArr = [];

		for ( var i = 0; i < array.length; i++ ) {
			found = undefined;
			for ( var j = 0; j < newArr.length; j++ ) {
				if (array[i] === newArr[j]){found = true;}
			}
			if (!found){
			newArr.push( array[i] );
			unique_tokenised_tweets.push(tokenised_tweets[i]);
			}   
		}
	   return newArr;
	}
	
	//remove duplicates
	unique_tokenised_tweets_str = noDuplicates(tokenised_tweets_str);
	
	//make token list to count word frequency for barchart
	for (var i=0; i < unique_tokenised_tweets.length; i++){
		for (var j=0; j < unique_tokenised_tweets[i].length; j++){
			if (typeof(unique_tokenised_tweets[i][j]) != "undefined"){
				tokens.push(unique_tokenised_tweets[i][j].toLowerCase());
			}
		};	
	};

	//get unique tokens
	var uniqueTokens = function(array) {
		var newArr = [];

		for ( var i = 0; i < array.length; i++ ) {
			found = undefined;
			for ( var j = 0; j < newArr.length; j++ ) {
				if (array[i] === newArr[j]){
					found = true; 
				}
			}
			if (!found){ newArr.push( array[i].toLowerCase() );}   
		}
	   return newArr;
	}
	//make the unique tokens array
	unique_tokens = uniqueTokens(tokens);
	
	//fill tokens_histo
	for ( var i = 0; i < unique_tokens.length; i++ ) {
		tokens_histo.push([unique_tokens[i],1]);
	}
	
	//get unique tokens
	for ( var i = 0; i < tokens.length; i++ ) {
		for ( var j = 0; j < tokens_histo.length; j++ ) {
			if (tokens[i] === tokens_histo[j][0]){
				tokens_histo[j][1] = tokens_histo[j][1]+1;
			}
		}   
	}
	
	//sort tokens_histogram by count
	tokens_histo = tokens_histo.sort(function(a,b) { return a[1] - b[1]; });
	
	var histo = tokens_histo.slice(tokens_histo.length - 10, tokens_histo.length);
	
	updateBarchart(histo);
}