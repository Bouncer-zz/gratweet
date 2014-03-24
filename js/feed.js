//maak variabelen aan voor text processing
function processText(){

var tweet_text = $("#query ul li .tweet_text");//the html source code of a tweet
var tweet_text_raw = new Array();//the raw unprocessed text of each tweet ("hello, world! #gratis bit.ly/slsekh")
var tokenised_tweets = new Array();//the tokenised text of each tweet ((["hello",","world","!","#gratis"]) )
var tokenised_tweets_str = new Array();//the processed non-tokenised text of each tweet (["hello world"]) 
var unique_tokenised_tweets_str = new Array();//the tokenised_tweets_str without identical tweets
var unique_tokenised_tweets = new Array();//the tokenised_tweets without identical tweets
var unique_tokens = new Array();//the unique tokens (these are the words left after all the processing and filtering)
var tokens = new Array();//the tokens extracted out of ALL the tweets in the feed (all the tokens left after filtering each tweet separately)
var left_tokens = new Array();//the tokens in front of the word gratis in each tweet
var right_tokens = new Array();//the tokens behind the word gratis in each tweet
var tokens_histo = new Array();//the unique_tokens with a score (consisting of the weights for each word + the word frequency)
var hashtags = new Array();//an array with the hashtags
var ats = new Array();// an array to contain everything starting with @ (e.g. @vu_amsterdam, @home)
var stopwords = ["aan", "afd", "als", "bij", "dat", "de", "den", "der", "des", "deze", "die", "dit", "dl", "door", "dr", "ed", "een", "en", 
"enige", "enkele", "enz", "er", "et", "etc", "haar", "het", "hierin", "hoe", "hun", "ik", "in", "inzake", "is", "je", "met", "na", "naar", 
"nabij", "niet", "no", "nog", "nu", "of", "om", "onder", "ons", "onze", "ook", "oorspr", "op", "over", "pas", "pres", "prof", "publ", "sl", 
"st", "te", "tegen", "ten", "ter", "tot", "uit", "uitg", "vakgr", "van", "vanaf", "vert", "vol", "voor", "voortgez", "voortz", "wat", "wie", "zijn"];//based on http://monchito.nl/blog/stopwoordenlijst and http://biblio.vub.ac.be/vubissmartweb/opac/stopwoorden.htm
var time_related_words = ["april", "augustus", "dag", "dagen", "dagje","datum", "december", "dinsdag", "donderdag", "februari", "gedurende","gisteren", "herfst", 
"jaar", "januari", "jaren", "julie", "juni", "lente", "maand", "maandag", "maanden", "maandje", "maart", "mei", "november", "nu", "oktober",
 "september","straks", "tijdens", "uur","vandaag","vanavond", "vrijdag", "week", "weekje", "weken", "winter", "woensdag", "zaterdag", "zomer","zometeen", "zondag"];// an array with words that are used to indicate time, which is not relevant for the barchart
var personal_pronouns = ["hij", "hun","ieder","iedere","iedereen", "ik", "je", "jij","jou", "jouw", "jullie", "onze", "u", "uw","uzelf", "we", "wij", "ze", "zij"];// based on http://www.dutchgrammar.com/en/?n=Verbs.re01
var filterwords = ["!", ",", ".", "a", "actie","af","alle","alles","alleen","as", "b","bedankt","bedanken","ben", "best","bestel","bestelt","bestellen" ,"best",
 "beste", "beste", "bestel","betekent", "beter","betekende","breng","brengen","brengt", "bit", "c", "check", "d", "dan","daar","deed","deel","delen","dld",
 "doe","doen","download","dus","duur", "e", "f", "fb","fuck", "g", "ga", "gaan", "gaat","gebruik","gebruiken","gebruikt", "geen","geef","geven","geeft",
 "gewoon","gingen", "goed", "goo","gr", "graag", "h","haal","halen","haalt","hebt","hebt,","hebben","hele","het","hier", "hij","houden","houdt","hield",
 "i","iemand","ipv", "iturl", "j", "jij", "k", "kan", "kans","klik", "kom", "komen","kost","kosten","kostte","krijg","krijgen","krijgt", "kunnen", "l",
 "laat","lang","lees", "leuk", "leuke","like","lief","lieve","leidt","leiden", "m","mee","meer","meld", "maak", "maakt", "maar","mag", "maken","mij","mijn","minimaal",
 "moet","mocht","mochten","moest","moeten","mp", "n","neem","neemt","nemen","niets","niet","nieuw","nieuwe", "nieuwsbrief","niks","nodig","nou",
 "nu", "o","online","ontvang", "ooit", "op","opgelet","opletten", "ow", "p","plaats", "pic","pijpen","probeer", "q", "r","retweet","retweeten",
 "retweetactie" ,"rt","rtactie","rtacties", "s", "schrijf","sletje","share","start", "t","tinyurl","twitter", "u", "u", "v","veel", "via","volg","volgen","volgers",
 "volgt", "voordeel", "voordelig","voorstel","voorstellen","vraag","vragen", "w", "waar", "weg","wel","wellicht","weer", "wil", "willen", "win",
 "winnen","wtf", "x", "y","youtu", "z","zag","zien"];//words and url remainders (e.g. goo, bit for bit.ly/ etc. ) that will be filtered out 
var weights = [192,128,64,32,16,8,6,4,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];//the weights used for scoring each word (the words next to the word gratis will receive 192, the weight represent a normal/gaussian distribution around the word gratis, with gratis in the middle)
				
	//extract the text and put them in array
	for (i=0;i<tweet_text.length;i++){
		tweet_text_raw.push(tweet_text[i].innerText); 
	}
	
	//function used for tokenising each tweet
	function splitString(string, separator) {
		var arrayOfStrings = string.split(separator);
		tokenised_tweets.push(arrayOfStrings);
	}
	
	//tokenize each tweet (based on a whitespace)
	for (var i=0; i < tweet_text_raw.length; i++){
		if (typeof(tweet_text_raw[i]) != "undefined"){
			splitString(tweet_text_raw[i], " ");
		}
	};
	
	//filter out hashtags, and @'s, while keeping the words in a tweet
	for (var i=0; i < tokenised_tweets.length; i++){
		for (var j=0; j < tokenised_tweets[i].length; j++){
			var token = tokenised_tweets[i][j];
			var hashtag = token.match(/(#\w+)/g);
			var at = token.match(/(@\w+)/g);
			var url = token.match(/\w{2}[.]\w{2}/g); 
			var word = token.match(/([a-z,A-z]+)/g);
			
			//remove the hashtags and url's from the tokenised_tweets for further processing
			if(hashtag != null || url != null){delete tokenised_tweets[i][j];}
			
			//if match and not #gratis, then add to hashtags array 
			if(hashtag != null && hashtag[0].toLowerCase() !="#gratis"){
				hashtag = hashtag[0].substring(1);//remove the '#' and keep the rest
				hashtags.push(hashtag);
			}
			
			//remove the @'s from the tokenised_tweets and add them to ats array
			if(at != null){
				at = at[0].substring(1);
				ats.push(at)
				delete tokenised_tweets[i][j];
			}
			
			//remove anything that isn't a word for further processing
			if(word === null){
				delete tokenised_tweets[i][j];							
			}
			else{
			tokenised_tweets[i][j] = word[0];
			}
			
			var token = tokenised_tweets[i][j];
			
			if (typeof(token) != "undefined"){ 
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
				
				//split the sentence into two parts. SPECIAL CASES: index = 0 OF index = tokenised_tweets[i].length. (the for loop for the left or right side will be skipped)
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

			//add the word x amount of times based on score, for tokens_histogram
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
	
	//remove the word gratis (the word cannot be filtered out earlier, due to the fact that the word is needed to find the index))
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
	
	//give the data to the barchart
	updateBarchart(histo);
}