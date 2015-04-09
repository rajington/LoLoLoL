var _ = require('cloud/vendor/underscore');
var collectionHelper = require('cloud/jobs/collectionHelper');
var CONSTANTS = require('cloud/jobs/constants');

Parse.Cloud.job("updateChampions", function(request, status) {
  Parse.Cloud.useMasterKey();

  var champions = collectionHelper.getCollection("Champion");
  var items = collectionHelper.getCollection("Item");
  var regionTiers = collectionHelper.getCollection("RegionTier");

  // variables that persist across promises
  var RIOT_API_KEY;

  Parse.Config.get(
  ).then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  }).then(function(){
    return Parse.Promise.when(
      _.map([champions, items, regionTiers], function(collection){
        collection.fetch();
      })
    );
  }).then(function(){
    var beginDate = Date.now()/1000 - 600; // 10 minutes ago
    beginDate -= beginDate%300; // floored to 5 minute increment

    var promises = [];
    _.each(CONSTANTS.REGIONS, function(region){
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
      var region = CONSTANTS.REGIONS[regionId];
      console.log(CONSTANTS.REGIONS[regionId] + ": " + matchIds.length);
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
        var team = _.findWhere(match.teams, {teamId: participant.teamId});
        var regionTier = regionTiers.getOrCreate(match.region.toLowerCase()+'_'+participant.highestAchievedSeasonTier);

        champion.updateAverages(CONSTANTS.STATS.CHAMPION, participant.stats);
        champion.updateAverages(CONSTANTS.STATS.CHAMPION_TEAM, team);
        champion.increment('samples');

        regionTier.updateAverages(CONSTANTS.STATS.REGION_TIER, participant.stats);
        regionTier.updateAverages(CONSTANTS.STATS.REGION_TIER_TEAM, team);
        regionTier.increment('samples');

        for(var i=0; i<=6; i++){
          var itemId = participant.stats['item'+i]
          if(itemId == 0) { continue; }

          var item = items.getOrCreate(itemId);
          item.updateAverages(CONSTANTS.STATS.ITEM, participant.stats);
          item.updateAverages(CONSTANTS.STATS.ITEM_TEAM, team);

          item.increment('samples');
        }
      });
    });

    return Parse.Promise.when(
      _.map([champions, items, regions], function(collection){
        Parse.Object.saveAll(collection.models);
      })
    );
  }).then(function(){
    status.success('Updated champions');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
