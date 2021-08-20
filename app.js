//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var unirest = require("unirest");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
   res.render("home.ejs");
});
app.get("/home", function(req, res){
   res.render("home.ejs");
});

app.get("/mood",function(req,res){
	res.render("mood.ejs");
});
//<form action=\"/search\" method=\"post\"><button type=\"submit\">Submit</button></form>

app.get("/resource",function(req,res){
	res.render("resource.ejs");
});

app.get("/search",function(req,res){
var songReq = unirest("GET", "https://shazam.p.rapidapi.com/search");
emotion = req.query.id
if (emotion == "fear")
{
  emotion = "brave";
}

// find the song
    songReq.query({
    	"term": emotion,
    	"locale": "en-US",
    	"offset": "0",
    	"limit": "5"
    });

    songReq.headers({
    	"x-rapidapi-key": "4e9781a532msh0865f249a6e9001p15211ajsn05fea621862b",
    	"x-rapidapi-host": "shazam.p.rapidapi.com",
    	"useQueryString": true
    });

    songReq.end(function (songRes) {
    	if (songRes.error) throw new Error(res.error);
    	const songTitle = songRes.body.tracks.hits[0].track.title;
      const songSinger = songRes.body.tracks.hits[0].track.subtitle;
      const songImage = songRes.body.tracks.hits[0].track.share.image;
      const songUri = songRes.body.tracks.hits[0].track.hub.actions[1].uri;

      const quotes = [];
      const activities = [];

      //find the quotes and activities
      let jsonData = require('./info.json');
      emotion = req.query.id;
	    const mood = jsonData[emotion].mood;

      for(var key in jsonData[emotion].quote)
      {
        quotes.push(jsonData[emotion].quote[key]);
      }

      for(var key in jsonData[emotion].activities)
      {
        activities.push(jsonData[emotion].activities[key]);
      }

      res.render('info', {emotion: mood, songTitle: songTitle, songImage: songImage, songUri: songUri, songSinger: songSinger, quotes: quotes, activities: activities});
	});

});

app.post("/search", function(req, res){
  var request = unirest("POST", "https://sightcorp-f-a-c-e-v1-1.p.rapidapi.com/api/detect/");
  var songReq = unirest("GET", "https://shazam.p.rapidapi.com/search");

  request.headers({
  	"content-type": "application/x-www-form-urlencoded",
  	"x-rapidapi-key": "ccd8b5ab4bmsh868091091857da0p1a4cb1jsn9a0efc99d2dc",
  	"x-rapidapi-host": "sightcorp-f-a-c-e-v1-1.p.rapidapi.com",
  	"useQueryString": true
  });

  request.form({
  "url": "https://i0.wp.com/grahamstoney.com/wp-content/uploads/Angry-Man.jpeg?resize=300%2C208&ssl=1",
  "app_key": "3f13d0e807134679bc1f9b16b41020ef"
  });

  request.end(function (response) {
  if (response.error) throw new Error(response.error);
    var max = 0;
    var emotion;
    const p = response.body.people[0].emotions;
    for (var key in p) {
      if (p[key] > max) {
          max = p[key]
          emotion = key;
      }
    }

   // find the song
    songReq.query({
    	"term": emotion,
    	"locale": "en-US",
    	"offset": "0",
    	"limit": "5"
    });

    songReq.headers({
    	"x-rapidapi-key": "4e9781a532msh0865f249a6e9001p15211ajsn05fea621862b",
    	"x-rapidapi-host": "shazam.p.rapidapi.com",
    	"useQueryString": true
    });


    songReq.end(function (songRes) {
      if (songRes.error) throw new Error(res.error);
      const songTitle = songRes.body.tracks.hits[0].track.title;
      const songSinger = songRes.body.tracks.hits[0].track.subtitle;
      const songImage = songRes.body.tracks.hits[0].track.share.image;
      const songUri = songRes.body.tracks.hits[0].track.hub.actions[1].uri;

      const quotes = [];
      const activities = [];

      //find the quotes and activities
      let jsonData = require('./info.json');
      const mood = jsonData[emotion].mood;

      for(var key in jsonData[emotion].quote)
      {
        quotes.push(jsonData[emotion].quote[key]);
      }

      for(var key in jsonData[emotion].activities)
      {
        activities.push(jsonData[emotion].activities[key]);
      }

      res.render('info', {emotion: mood, songTitle: songTitle, songImage: songImage, songUri: songUri, songSinger: songSinger, quotes: quotes, activities: activities});
    });
  });

});
app.listen(5000, function(){
  console.log("Server has started on port 5000")
})
