var _ = require('underscore');
var collectionHelper = require('cloud/jobs/collectionHelper');

Parse.Cloud.job("updateChampions", function(request, status) {
  Parse.Cloud.useMasterKey();

  var champions = collectionHelper.getCollection("Champion");

  // variables that persist across promises
  var RIOT_API_KEY, REGIONS, NUMBER_STATS;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    REGIONS = config.get('REGIONS');
    CHAMPION_PARTICIPANT_STATS = config.get('CHAMPION_PARTICIPANT_STATS');
    return RIOT_API_KEY;
  }).then(function(){
    return champions.fetch();
  }).then(function(){
    var beginDate = Date.now()/1000 - 600; // 10 minutes ago
    beginDate -= beginDate%300; // floored to 5 minute increment

    var promises = [];
    _.each(REGIONS, function(region){
      promises.push(
        Parse.Cloud.httpRequest({
          url: 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v4.1/game/ids',
          params: {
            api_key: RIOT_API_KEY,
            beginDate: beginDate
          }
        }).then(function(response){
          return response.data;
        })
      );
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    // console.log("Found: " + response.data.length + " samples @ " + beginDate);
    // var matchIds = _.first(response.data, 9); // make sure we don't go over our rate-limit
    var promises = [];
    // console.log(arguments);
    _.each(arguments, function(matchIds, regionId){
      var region = REGIONS[regionId];
      console.log(REGIONS[regionId] + ": " + matchIds.length);
      _.each(_.first(matchIds, 1), function(matchId){
        promises.push(
          Parse.Cloud.httpRequest({
            url: 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/'+matchId,
            params: {
              api_key: RIOT_API_KEY
            }
          })
        );
      });
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    _.each(arguments, function(response){
      var match = response.data;
      _.each(match.participants, function(participant){
        var champion = champions.getOrCreate(participant.championId);
        _.each(CHAMPION_PARTICIPANT_STATS, function(stat){
          champion.updateAverage(stat, participant.stats[stat]);
        });
        champion.increment('samples');
      });
    });
    return Parse.Object.saveAll(champions.models);
  }).then(function(){
    status.success('Updated champions');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
