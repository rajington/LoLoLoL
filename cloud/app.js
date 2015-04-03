
// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


// TODO: definitely don't do this here like this, this is just for rate limit increase request
app.get('/riot', function(req, res) {
  var query = new Parse.Query("Champion");
  query.limit(1000);
  query.descending('minionsKilled');
  query.find().then(function(champions) {
    res.render('riot', { champions: champions });
  });
});

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
  var mostKills =
    [{
      champName: 'Draven',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg',
      quote: '"Welcome to the League of Slaughtering Minions"',
      totalMinionKills: 25089,
      minionKillsPerMin: 17
    },{
      champName: 'Ziggs',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ziggs_0.jpg',
      quote: '"Killing minions will be a blast!"',
      totalMinionKills: 20713,
      minionKillsPerMin: 15
    },{
      champName: 'Malphite',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Malphite_0.jpg',
      quote: '"Watching minions die makes me rock solid."',
      totalMinionKills: 17476,
      minionKillsPerMin: 12
    }];

  var leastKills =
    [{
      champName: 'Malzahar',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Malzahar_0.jpg',
      totalMinionKills: 568,
      minionKillsPerMin: 1
    },{
      champName: 'Sona',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Sona_0.jpg',
      totalMinionKills: 822,
      minionKillsPerMin: 2
    },{
      champName: 'Twisted Fate',
      mugshot: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/TwistedFate_0.jpg',
      totalMinionKills: 1209,
      minionKillsPerMin: 5
    }];
  res.render('splash', { mostMinionsKilledChamps : mostKills, leastMinionsKilledChamps: leastKills });
});

// Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
  // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
