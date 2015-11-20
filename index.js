'use strict';

var express = require('express');
var hbs = require('hbs');
var Twitter = require('twitter');
var bodyParser = require('body-parser');

var app = express();
var twitterResults;


// Set static folder
app.use(express.static('static'));

// Set rendering engine
app.set('view engine', 'html');
app.engine('html', hbs.__express);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Should move this for privacy
var client = new Twitter({
  consumer_key: 'YjICBJeNlnxAf3tFw7awLaCzS',
  consumer_secret: '8IfPzkr4opePnhCLLloKMP6X44IeNav0fLDrmtBrPbaHoxd1nO',
  access_token_key: '4146680697-oOEPVezvvZ82vB7iP9HSbkoTG9ze9gH69XLrSCP',
  access_token_secret: 'HZjsaabmVjeSkSX6vvVFdT3GWZek8xJ9RKfwaR57RDyEG'
});


// Start Server
var server = app.listen(3000);


var twitterResults;
var oldBody;

function queryTwitter(req, callback) {
callback = (typeof callback === 'function')? callback : function(){};

if(oldBody!=req) {
	oldBody = req;

client.get('search/tweets', {q: req.body.match, geocode : req.body.country, lang: req.body.lang, count: 100},  function(error, tweets, response){
	
   if(error){
     console.log('There was an error.', error);
   }
   twitterResults = {search: tweets.search_metadata, results: tweets.statuses};
   callback();
 });

} else {
return twitterResults;
callback();
}

}





/* 
 * Routing
 */
 //Home
 
 app.get('/', function(req, res) {
res.render ('index' , {});
});

 app.post('/', function(req, res){  
 queryTwitter(req, function(){
   res.status(200).render('index', twitterResults);  
 });  
});
 


//Summary Page
app.get('/summary', function(req, res) {
 res.render ('summary' , {});
});

//API view
app.get('/api', function(req, res){
   res.send(twitterResults);
});



