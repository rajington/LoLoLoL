var _ = require('underscore');

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

  var mostKills = [];
  var leastKills = [];

  var RIOT_API_KEY;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  });

  // TODO: definitely want to refactor these calls out and store some of this data locally
  // in files if possible (though I'm not sure if that's going to soften the i/o blow)
  var mostQuery = new Parse.Query("Champion");
  mostQuery.descending("minionsKilled");
  mostQuery.limit(3);
  mostQuery.find().then(function(champions){
    var promises = [];
    _.each(champions, function(champ){
      promises.push(

          Parse.Cloud.httpRequest({
            url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champ.get('championId'),
            params: {
              api_key: RIOT_API_KEY
            },
            success: function(resp) {
              console.log('got most killed cs champs succssfully')
            },
            error: function(resp) {
              console.log('did not get most killed cs champs succssfully: ' + resp.status)
            }
          }).then(function(response){
            var responseData = response.data;;
            var mergedData = _.extend(responseData, champ.attributes);
            return mostKills.push(mergedData);
          })

      )
    });
    return Parse.Promise.when(promises);
  });


  var leastQuery = new Parse.Query("Champion");
  leastQuery.ascending("minionsKilled");
  leastQuery.limit(3);
  leastQuery.find().then(function(champions){
    var promises = [];
    _.each(champions, function(champ){
      promises.push(

          Parse.Cloud.httpRequest({
            url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champ.get('championId'),
            params: {
              api_key: RIOT_API_KEY
            },
            success: function(resp) {
              console.log('got least killed cs champs succssfully')
            },
            error: function(resp) {
              console.log('did not get least killed cs champs succssfully: ' + resp.status)
            }
          }).then(function(response){
            var responseData = response.data;
            var mergedData = _.extend(responseData, champ.attributes);
            return leastKills.push(mergedData);
          })

      )
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    res.render('splash', { mostMinionsKilledChamps : mostKills, leastMinionsKilledChamps: leastKills });
  });
});

app.get('/champion/:id', function(req, res) {

  var RIOT_API_KEY;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  }).then(function(){
    return Parse.Cloud.httpRequest({
      url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + req.params.id,
      params: {
        api_key: RIOT_API_KEY,
        champData: 'all'
      },
      success: function(response) {
        res.render('champion', { champData: response.text });
      }
    });
  });

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
