// ----------------------------------START------------------------------------------//

require("dotenv").config();

var keys = require("./keys");

// Twitter Code
	// Twitter npm 
	var Twitter = require("twitter");

// pull Twitter API info from keys.js
	var twitter = new Twitter ({
  	consumer_key: keys.twitterKeys.consumer_key,
  	consumer_secret: keys.twitterKeys.consumer_secret,
  	access_token_key: keys.twitterKeys.access_token_key,
  	access_token_secret: keys.twitterKeys.access_token_secret
	});

// my account "@steliopartidus"
	var myTweets = {screen_name:"DJTurner4U"};

// Spotify Code
	// to include the Node Spotify API npm package
	var Spotify = require("node-spotify-api");

// pulling Node Spotify API info from keys.js
	var spotify = new Spotify ({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret
	});

// variable to hold song the user wants to search for with Spotify
	var songChoice = "";

// OMDB Code 
// to include the Request API npm package
// this will be used for the Open Movie Database (OMDB)
var request = require("request");

// variable to hold movie the user wants to search for with OMDB
var omdbRequest = "";

//to include the fs library
var fs = require("fs");

// the Calls
var userCommand = process.argv[2];

// -----------------------------------||--------------------------------------------//
// ---------------------------------\-||-/------------------------------------------//
// ----------------------------------\--/-------------------------------------------//
// -----------------------------------\/--------------------------------------------//
// If Statements //
// twitter calls
if (userCommand === "my-tweets") {
	twitterCall();
}

//spotify calls 
else if (userCommand === "spotify-this-song") {
	spotifyCheck();
	spotifyCall(songChoice);
	}

//for the open movie database (OMDB) calls
else if (userCommand === "movie-this") {
	movieCheck();
	movieCall(omdbRequest);
	}

//for the do-what-it-says call
else if (userCommand === "do-what-it-says") {
	youCanDoIt();
	}

//if the user forgets to put in a command for process.argv[2]
//or if the command is spelled incorrectly
else {return console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says."+"\r\n"+
			"Be sure to put the movie or song name in quotation marks if it's more than one word.");
	}
// -----------------------------------||--------------------------------------------//
// ---------------------------------\-||-/------------------------------------------//
// ----------------------------------\--/-------------------------------------------//
// -----------------------------------\/--------------------------------------------//
//======================= THE FUNCTIONS =======================
//function for the Twitter calls
function twitterCall() {
	twitter.get("statuses/user_timeline", myTweets, function(error, tweets, response){
		if(error) {
			return console.log(error);
		} else {
			console.log(myTweets.screen_name + "'s Tweets:");
			console.log("-------------------------------BEGIN-------------------------------");
			for (var i = 0; i < tweets.length; i++) {

				//convert UTC time to local time for tweet timestamp part 1
				var tweetDate = new Date(tweets[i].created_at);
				console.log(tweets[i].text);

				//convert UTC time to local time for tweet timestamp part 2
				console.log(tweetDate.toString()); 
				console.log("-------------------------------------------------------------------");
			}
		}
	});
};

//functions for the spotify calls
//spotifyCheck() figures out what the user is searching and puts it in variable songChoice
function spotifyCheck () {
	//if the user doesn't put in a song, the default will be a lonely island song.
	if (!process.argv[3]) {
		songChoice = "I just had sex";
	} else {
		//this accomodates song titles with multiple words in it
		for (j = 3; j < process.argv.length; j++) {
			songChoice = process.argv[j];
				}
	}
};

//spotifyCall() executes the search with songChoice
function spotifyCall(songChoice) {
	spotify.search({type: "track", query: songChoice, limit: 1}, function(error, response){
		if (error) {
			return console.log(error);
		}
		//printing out song information
		for (var k = 0; k < response.tracks.items[0].album.artists.length; k++) {
			var musicResults = "-------------------------------BEGIN-------------------------------" + "\r\n" +
			"Artist(s): " + response.tracks.items[0].album.artists[k].name +"\r\n"+
			"Song: " + response.tracks.items[0].name + "\r\n"+
			"Song Link: " + response.tracks.items[0].external_urls.spotify + "\r\n"+
			"Album: " + response.tracks.items[0].album.name + "\r\n"+ 
			"------------------------------ FINISH -----------------------------" + "\r\n";
			console.log(musicResults);
		}
	});
};

function movieCheck() {
	//If no movie defined in command, the default search will be Anchorman: The Legend of Ron Burgundy
	if (!process.argv[3]) {
		omdbRequest = "Anchorman: The Legend of Ron Burgundy";
	} else {
		//Accomodates movie titles containing multiple words
		for (var k = 3; k < process.argv.length; k++) {
			omdbRequest += process.argv[k] + "+";
			//console.log(omdbRequest); //test
		}
	}
};

function movieCall(omdbRequest) {
	//variable to hold the omdb url search with api key and omdb request
	var omdbMovie = "http://www.omdbapi.com/?apikey=a417ab4c&t=" + omdbRequest;

	request(omdbMovie, function (error, response, body) {
		if (error) {
			return console.log(error);
		}
		// desired information
		var movieObject = JSON.parse(body);
		var movieResults = 
		"------------------------------ BEGIN ------------------------------" + "\r\n" +
		"Title: " + movieObject.Title +"\r\n"+
		"Year: " + movieObject.Year+"\r\n"+
		"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
		"Country: " + movieObject.Country+"\r\n"+
		"Language: " + movieObject.Language+"\r\n"+
		"Plot: " + movieObject.Plot+"\r\n"+
		"Actors: " + movieObject.Actors+"\r\n"+
		"Released Year: " + movieObject.Released+"\r\n"+
		"Run-time: " + movieObject.Runtime + "\r\n" + 
		"Director: " + movieObject.Director + "\r\n" + 
		"Writer: " + movieObject.Writer + "\r\n" + 
		"Awards: " + movieObject.Awards + "\r\n" + 
		"DVD Release Date: " + movieObject.DVD + "\r\n" + 
		"------------------------------ FINISH -----------------------------" + "\r\n";
		console.log(movieResults);
	});

};


//function for the do-what-it-says call
function youCanDoIt() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		} else {
			//splits whatever is in random.txt into strings.
			//the split occurs wherever a comma exists.
			//each split string is put into an index in an array call "theSplit"
			var theSplit = data.split(",");

			if (theSplit[0] === "spotify-this-song") {
				songChoice = theSplit[1];

				//this will skip over spotifyCheck() and 
				//execute spotifyCall() with songChoice = whatever is in index 1 of theSplit
				spotifyCall(songChoice);
			} 

			else if (theSplit[0] === "movie-this") {
				omdbRequest = theSplit[1];

				//this will skip over omdbCheck() and 
				//execute omdbCall() with omdbRequest = whatever is in index 1 of theSplit
				movieCall(omdbRequest);
			}

			else if (theSplit[0] === "my-tweets") {
				myTweets.screen_name = theSplit[1];
				//console.log(myTweets.screen_name); //test

				//execute twitterCall, pulls tweets from whatever account theSplit[1] is
				//if testing this call out, DO NOT USE " " OR ' ' AROUND THE SCREEN NAME FOR INDEX 1 
				//IN random.txt!! 
				twitterCall();
			}

			else {
				console.log("Error: Apparently I can't do what it says.")
			}

			//console.log(data); //test
			//console.log(theSplit); //test

		}

	});
}
    // ----------------------------------\\--//---------------------------------------//
    // -----------------------------------\\//----------------------------------------//
    // -----------------------------------END-----------------------------------------//
    // -----------------------------------//\\----------------------------------------//
    // ----------------------------------//--\\---------------------------------------//