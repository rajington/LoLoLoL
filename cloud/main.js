var _ = require('underscore');

Parse.Cloud.job("updateChampions", function(request, status) {
  var RIOT_API_KEY;
  var beginDate = Date.now()/1000 - 3600; // 1 hour ago
  beginDate -= beginDate%300; // floored to 5 minute increment

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  }).then(function(){
    return Parse.Cloud.httpRequest({
      url: 'https://na.api.pvp.net/api/lol/na/v4.1/game/ids',
      params: {
        api_key: RIOT_API_KEY,
        beginDate: beginDate
      }
    })
  }).then(function(response){
    console.log("Found: " + response.data.length + " matches @ " + beginDate);

    var matchIds = _.first(response.data, 9); // make sure we don't go over our rate-limit
    var promises = [];
    _.each(matchIds, function(matchId){
      promises.push(Parse.Cloud.httpRequest({
          url: 'https://na.api.pvp.net/api/lol/na/v2.2/match/'+matchId,
          params: {
            api_key: RIOT_API_KEY
          }
        }).then(function(response){
          return _.map(response.data.participants, function(participant){
            return {
              championId: participant.championId,
              minionsKilled: participant.stats.minionsKilled
            };
          });
        }));
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    var Champion = Parse.Object.extend("Champion");
    var champions = _.chain(arguments)
      .flatten()
      .map(function(champion){ return new Champion(champion); })
      .value();
    return Parse.Object.saveAll(champions);
  }).then(function(){
    status.success('Updated champions');
  }, function(error){
    status.error('Failed to update champions');
  });
});
