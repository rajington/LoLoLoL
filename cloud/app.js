var _ = require('underscore');
var scores = require('cloud/champ-score-comments');

// we should get this via a background job and config variable later
var version = "5.7.2";

// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

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
            url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champ.get('identifier'),
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
            url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champ.get('identifier'),
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

app.get('/champion', function(req, res) {

  var sort = req.query.sort || 'asc';

  var champions = [];
  var champInfo = {};
  var champInfoDebug = {};

  var query = new Parse.Query("Champion");
  if(sort == 'asc') {
    query.ascending("minionsKilled");
  } else {
    query.descending("minionsKilled");
  }
  query.limit(300);
  query.find().then(function(champs){
    champions = champs;

    return Parse.Cloud.httpRequest({
      url: 'http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json',
      success: function(resp) {
        console.log('got champion.json');
      },
      error: function(resp) {
        console.log('did not get champion json succssfully: ' + resp.status);
      }
    });

  }).then(function(response){
    _.each(response.data.data, function(value, key){
      champInfo[value.key] = key;
    });
    champInfoDebug = response.text;
  }).then(function(){
    res.render('champions', { champions: champions, champInfo: champInfo, champInfoDebug:champInfoDebug, version: version });
  });

});

app.get('/champion/:id', function(req, res) {
  var champId = parseInt(req.params.id, 10);

  var RIOT_API_KEY;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  });

  var champData;

  var query = new Parse.Query("Champion");
  query.equalTo('identifier', champId);
  query.find().then(function(champ) {
    champData = champ[0];

    return Parse.Cloud.httpRequest({
      url: 'https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + champId,
      params: {
        api_key: RIOT_API_KEY
      },
      success: function(resp) {
        console.log('got static champ json');
      },
      error: function(resp) {
        console.log('did not get static champ json succssfully: ' + resp.status);
      }
    });
  }).then(function(staticData){
    res.render('champion', { champData: champData, staticData: staticData.data, scoreComments: scores.getScoreComments(staticData.data.key) });
  });

});

// TODO: view caching should be enabled!
app.get('/tables', function(req, res) {
  Parse.Cloud.useMasterKey();
  var tables = [
    {collection: 'Champion', limit: 1000},
    {collection: 'Item', limit: 1000},
    {collection: 'RegionTier', limit: 1000},
    {collection: 'Summoner', sort: 'assists'},
    {collection: 'Summoner', sort: 'goldEarned'},
    {collection: 'Summoner', sort: 'kills'},
    {collection: 'Summoner', sort: 'largestCriticalStrike'},
    {collection: 'Summoner', sort: 'largestKillingSpree'},
    {collection: 'Summoner', sort: 'magicDamageDealtToChampions'},
    {collection: 'Summoner', sort: 'minionsKilled'},
    {collection: 'Summoner', sort: 'neutralMinionsKilled'},
    {collection: 'Summoner', sort: 'pentaKills'},
    {collection: 'Summoner', sort: 'physicalDamageDealtToChampions'},
    {collection: 'Summoner', sort: 'totalDamageDealt'},
    {collection: 'Summoner', sort: 'totalDamageDealtToChampions'},
    {collection: 'Summoner', sort: 'totalDamageTaken'},
    {collection: 'Summoner', sort: 'totalHeal'},
    {collection: 'Summoner', sort: 'totalTimeCrowdControlDealt'},
    {collection: 'Summoner', sort: 'totalUnitsHealed'},
    {collection: 'Summoner', sort: 'objectives'}
  ];

  var promises = _.map(tables, function(table){
    table = _.defaults(table, {sort: 'minionsKilled', limit: 10});
    var query = new Parse.Query(table.collection);
    query.descending(table.sort);
    query.limit(table.limit);
    return query.collection().fetch().then(function(results){
      table.results = results.toJSON();
    });
  });

  Parse.Promise.when(promises).then(function(){
    res.render('tables', { tables: tables });
  }, function(error){
    res.status(400).json({error: error});
  });
});

app.post('/summoners', function(req, res) {
  var region = req.body.region;
  var name = req.body.name;
  var summoner;
  Parse.Config.get().then(function(config){
    return config.get('RIOT_API_KEY');
  }).then(function(RIOT_API_KEY){
    return Parse.Cloud.httpRequest({
      url: 'https://'+region+'.api.pvp.net/api/lol/'+region+'/v1.4/summoner/by-name/'+name,
      params: {
        api_key: RIOT_API_KEY
      }
    });
  }).then(function(response){
    Parse.Cloud.useMasterKey();
    summoner = response.data[name];
    var query = new Parse.Query("Summoner");
    query.equalTo('identifier', summoner.id);
    return query.first();
  }).then(function(result){
    if(_.isUndefined(result)){
      var Summoner = Parse.Object.extend("Summoner");
      var newSummoner = new Summoner({
        identifier: summoner.id,
        region: region,
        name: summoner.name,
        profileIconId: summoner.profileIconId
      });
      return newSummoner.save();
    }
  }).then(function(newSummoner){
    if(newSummoner){
      res.end();
    } else {
      res.status(409).json({error: 'already exists'});
    }
  }, function(error){
    res.status(404).json({error: 'name not found'});
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
