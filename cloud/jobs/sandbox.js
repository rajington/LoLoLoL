var _ = require('underscore');

Parse.Cloud.job("sandbox", function(request, status) {
  Parse.Cloud.useMasterKey();
  var Champion = Parse.Object.extend("Champion");

  // variables that persist across promises
  var RIOT_API_KEY;
  var champions;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  }).then(function(){
    var query = new Parse.Query(Champion);
    query.limit(1000); // set it to get the max number of champs
    return query.collection().fetch();
  }).then(function(championCollection){
    champions = championCollection;
  }).then(function(){
    var beginDate = Date.now()/1000 - 3600; // 1 hour ago
    beginDate -= beginDate%300; // floored to 5 minute increment

    return Parse.Cloud.httpRequest({
      url: 'https://na.api.pvp.net/api/lol/na/v4.1/game/ids',
      params: {
        api_key: RIOT_API_KEY,
        beginDate: beginDate
      }
    })
  }).then(function(response){
    // console.log("Found: " + response.data.length + " matches @ " + beginDate);

    var matchIds = _.first(response.data, 2); // make sure we don't go over our rate-limit
    var promises = [];
    _.each(matchIds, function(matchId){
      promises.push(Parse.Cloud.httpRequest({
          url: 'https://na.api.pvp.net/api/lol/na/v2.2/match/'+matchId,
          params: {
            api_key: RIOT_API_KEY
          }
        }).then(function(response){
          var matchDuration = response.data.matchDuration/60;
          return _.map(response.data.participants, function(participant){
            return {
              championId: participant.championId,
              minionsKilled: participant.stats.minionsKilled/matchDuration
            };
          });
        }));
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    _.chain(arguments)
      .flatten()
      .each(function(championStatistic){
        // console.log(championStatistic);
        var championObject = champions.find(function(champion){
          return champion.get("championId") == championStatistic.championId;
        });
        if(_.isUndefined(championObject)){
          // console.log("Could not find " + championStatistic.championId + " in " + champions.models.length);
          championObject = new Champion(championStatistic);
          champions.add(championObject);
        } else {
          //TODO: make this an instance method
          var average = championObject.get("minionsKilled");
          var matches = championObject.get("matches");
          var next = championStatistic.minionsKilled;
          average += (next-average)/(matches+1);
          championObject.set("minionsKilled", average);
        }
        championObject.increment("matches");
      });
    // console.log(_.flatten(arguments).length);
    // console.log(champions.toJSON());
    // console.log(champions.models.length);
    return Parse.Object.saveAll(champions.models);
  }).then(function(){
    status.success('Updated champions');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
