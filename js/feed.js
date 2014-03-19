//maak variabelen aan voor text processing
function processText(){

var tweet_text = $("#query ul li .tweet_text");
var tweet_text_raw = new Array();
var tokenised_tweets = new Array();
var tokenised_tweets_str = new Array();
var unique_tokenised_tweets_str = new Array();
var unique_tokenised_tweets = new Array();
var unique_tokens = new Array();
var tokens = new Array();
var left_tokens = new Array();
var right_tokens = new Array();
var tokens_histo = new Array();
var hashtags = new Array();
var ats = new Array();// an array to contain everything starting with @ (e.g. @vu_amsterdam, @home)
var stopwords = ["aan", "afd", "als", "bij", "dat", "de", "den", "der", "des", "deze", "die", "dit", "dl", "door", "dr", "ed", "een", "en", 
"enige", "enkele", "enz", "er", "et", "etc", "haar", "het", "hierin", "hoe", "hun", "ik", "in", "inzake", "is", "je", "met", "na", "naar", 
"nabij", "niet", "no", "nog", "nu", "of", "om", "onder", "ons", "onze", "ook", "oorspr", "op", "over", "pas", "pres", "prof", "publ", "sl", 
"st", "te", "tegen", "ten", "ter", "tot", "uit", "uitg", "vakgr", "van", "vanaf", "vert", "vol", "voor", "voortgez", "voortz", "wat", "wie", "zijn"];//based on http://monchito.nl/blog/stopwoordenlijst and http://biblio.vub.ac.be/vubissmartweb/opac/stopwoorden.htm
var time_related_words = ["april", "augustus", "dag", "dagen", "dagje","datum", "december", "dinsdag", "donderdag", "februari", "gedurende","gisteren", "herfst", 
"jaar", "januari", "jaren", "julie", "juni", "lente", "maand", "maandag", "maanden", "maandje", "maart", "mei", "november", "nu", "oktober",
 "september","straks", "tijdens", "uur","vandaag","vanavond", "vrijdag", "week", "weekje", "weken", "winter", "woensdag", "zaterdag", "zomer","zometeen", "zondag"];
var personal_pronouns = ["hij", "hun","ieder","iedere","iedereen", "ik", "je", "jij","jou", "jouw", "jullie", "onze", "u", "uw","uzelf", "we", "wij", "ze", "zij"];// based on http://www.dutchgrammar.com/en/?n=Verbs.re01
var filterwords = ["!", ",", ".", "a", "actie","af","alle","alles","alleen","as", "b","bedankt","bedanken","ben", "best","bestel","bestelt","bestellen" ,"best",
 "beste", "beste", "bestel","betekent", "beter","betekende","breng","brengen","brengt", "bit", "c", "check", "d", "dan","daar","deed","deel","delen","dld",
 "doe","doen","download","dus","duur", "e", "f", "fb","fuck", "g", "ga", "gaan", "gaat","gebruik","gebruiken","gebruikt", "geen","geef","geven","geeft",
 "gewoon","gingen", "goed", "goo","gr", "graag", "h","haal","halen","haalt","hebt","hebt,","hebben","hele","het","hier", "hij","houden","houdt","hield",
 "i","iemand","ipv", "iturl", "j", "jij", "k", "kan", "kans","klik", "kom", "komen","kost","kosten","kostte","krijg","krijgen","krijgt", "kunnen", "l",
 "laat","lang","lees", "leuk", "leuke","like","lief","lieve", "m","mee","meer","meld", "maak", "maakt", "maar","mag", "maken","mij","mijn","minimaal",
 "moet","mocht","mochten","moest","moeten","mp", "n","neem","neemt","nemen","niets","niet","nieuw","nieuwe", "nieuwsbrief","niks","nodig","nou",
 "nu", "o","online","ontvang", "ooit", "op","opgelet","opletten", "ow", "p","plaats", "pic","pijpen","probeer", "q", "r","retweet","retweeten",
 "retweetactie" ,"rt","rtactie","rtacties", "s", "schrijf","share", "t","tinyurl","twitter", "u", "u", "v","veel", "via","volg","volgen","volgers",
 "volgt", "voordeel", "voordelig","voorstel","voorstellen","vraag","vragen", "w", "waar", "weg","wel","wellicht","weer", "wil", "willen", "win",
 "winnen","wtf", "x", "y","youtu", "z","zag","zien"];
var weights = [192,128,64,32,16,8,6,4,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
				
	//haal de text uit de html en stop ze in array
	for (i=0;i<tweet_text.length;i++){
		tweet_text_raw.push(tweet_text[i].innerText); 
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
				for (var k=0; k < filterwords.length; k++){
					
					//remove the stopwords and filterwords from the tokenised_tweets for further processing
					if(token.toLowerCase() === stopwords[k] || token.toLowerCase() === filterwords[k] ||
						token.toLowerCase() === personal_pronouns[k] || token.toLowerCase() === time_related_words[k] ){
						delete tokenised_tweets[i][j];
					}
					if(token.toLowerCase() === filterwords[k]){
						delete tokenised_tweets[i][j];
					}					
				};
			
			}
		};				
	};	

	//filter out all the undefined elements
	for (var i=0; i < tokenised_tweets.length; i++){
		tokenised_tweets[i] = tokenised_tweets[i].filter(function(n){ return n != undefined });
	};
	
	//give weights to the words closer to the word 'gratis'
	for (var i=0; i < tokenised_tweets.length; i++){

		//find the index of the word gratis
		for (var j=0; j < tokenised_tweets[i].length; j++){
			
			var index = -10;
			//if the word gratis is present:
			if (tokenised_tweets[i][j].toLowerCase() === "gratis"){

				//set index
				index = j;
				
				//split the sentence into two parts. SPECIAL CASES: index = 0 OF index = tokenised_tweets[i].length. Dan zal for loop overgeslagen worden.
				var left = tokenised_tweets[i].slice(0,index);
				left_tokens.push(left);
				var right = tokenised_tweets[i].slice(index+1,tokenised_tweets[i].length);
				right_tokens.push(right);
			}
		};	
	};

	//give weights to tokens in the left_tokens array based on proximity to the word 'gratis'
	for (var i=0; i < left_tokens.length; i++){
		
		for (var k = left_tokens[i].length-1; k > 0; k--){

			var weight_index = left_tokens[i].length-(k+1);
			var score = weights[weight_index];

			//add the word x amount of times based on score, for histogram
			for (var w = 0; w < score; w++){
				if (typeof(tokenised_tweets[i]) != "undefined" && typeof(left_tokens[i][k]) != "undefined"){
					tokenised_tweets[i].push(left_tokens[i][k]);
				}
			};	
		};
	};
	
	//give weights to right_tokens array
	for (var i=0; i < right_tokens.length; i++){
		for (var r=0; r < right_tokens[i].length; r++){

			var score = weights[r];

			for (var w = 0; w < score; w++){
				if (typeof(tokenised_tweets[i]) != "undefined" && typeof(right_tokens[i][r]) != "undefined"){
					tokenised_tweets[i].push(right_tokens[i][r]);
				}
			};	
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
	tokens_histo = tokens_histo.sort(function(a,b) {
		return a[1] == b[1] ? 0 : (a[1] > b[1] ? -1 : 1)
	});
	
	//remove the word gratis
	for ( var i = 0; i < tokens_histo.length; i++ ) {
		if(tokens_histo[i][0]==="gratis"){
			delete tokens_histo[i];
		}
	};

		//filter out all the undefined elements
	for (var i=0; i < tokens_histo.length; i++){
		tokens_histo = tokens_histo.filter(function(n){ return n != undefined });
	};
	var histo = tokens_histo.slice(0, 10);
	
	updateBarchart(histo);
}