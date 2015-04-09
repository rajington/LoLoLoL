var _ = require('cloud/vendor/underscore');
var collectionHelper = require('cloud/jobs/collectionHelper');
var CONSTANTS = require('cloud/jobs/constants');

Parse.Cloud.job("processMatches", function(request, status) {
  Parse.Cloud.useMasterKey();

  var output = function(message){
    status.message(message);
    console.log(message);
  }

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
    output('fetching collections');
    return Parse.Promise.when(
      _.map([champions, items, regionTiers], function(collection){
        collection.fetch();
      })
    );
  }).then(function(){
    var beginDate = Date.now()/1000 - 600; // 10 minutes ago
    beginDate -= beginDate%300; // floored to 5 minute increment

    output('fetching matches at ' + beginDate);
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
    var numMatches = _.reduce(arguments, function(memo, matches){
      return memo + matches.length;
    }, 0);
    output('fetching ' + numMatches + ' matches');
    var promises = [];
    _.each(arguments, function(matchIds, regionId){
      var region = CONSTANTS.REGIONS[regionId];
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
    output('processing matches');
    _.each(arguments, function(response){
      var match = response.data;
      _.each(match.participants, function(participant){
        var champion = champions.getOrCreate(participant.championId);
        var stats = {
          PARTICIPANT: participant.stats,
          TEAM: _.findWhere(match.teams, {teamId: participant.teamId})
        };
        var regionTier = regionTiers.getOrCreate(match.region.toLowerCase()+'_'+participant.highestAchievedSeasonTier);


        champion.updateAverages(CONSTANTS.STATS.CHAMPION, stats);
        regionTier.updateAverages(CONSTANTS.STATS.REGION_TIER, stats);

        for(var i=0; i<=6; i++){
          var itemId = participant.stats['item'+i]
          if(itemId == 0) { continue; }

          var item = items.getOrCreate(itemId);
          item.updateAverages(CONSTANTS.STATS.ITEM, stats);
        }
      });
    });

    output('saving collections');
    return Parse.Promise.when(
      _.map([champions, items, regionTiers], function(collection){
        Parse.Object.saveAll(collection.models);
      })
    );
  }).then(function(){
    status.success('processed matches');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
