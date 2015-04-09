var _ = require('cloud/vendor/underscore');
var collectionHelper = require('cloud/jobs/collectionHelper');
var CONSTANTS = require('cloud/jobs/constants');

Parse.Cloud.job("processMatches", function(request, status) {
  Parse.Cloud.useMasterKey();

  var output = function(message){
    status.message(message);
    console.log(message);
  }

  // variables that persist across promises
  var RIOT_API_KEY, numMatches, beginDate;

  var champions = collectionHelper.getCollection("Champion");
  var items = collectionHelper.getCollection("Item");
  var regionTiers = collectionHelper.getCollection("RegionTier");
  var collections = [champions, items, regionTiers];
  var regions = CONSTANTS.REGIONS;
  // regions = _.sample(regions, 1); // debugging purposes

  Parse.Config.get(
  ).then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY')
    return RIOT_API_KEY;
  }).then(function(){
    output('fetching collections');
    return Parse.Promise.when(
      _.map(collections, function(collection){
        collection.fetch();
      })
    );
  }).then(function(){
    beginDate = Date.now()/1000 - 600; // 10 minutes ago
    beginDate -= beginDate%300; // floored to 5 minute increment

    output('fetching matches at ' + beginDate);
    var promises = [];
    _.each(regions, function(region){
      promises.push(
        Parse.Cloud.httpRequest({
          url: 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v4.1/game/ids',
          params: {
            api_key: RIOT_API_KEY,
            beginDate: beginDate
          }
        })
      );
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    numMatches = _.reduce(arguments, function(sum, response){
      return sum + response.data.length;
    }, 0);
    output('fetching ' + numMatches + ' matches');
    var promises = [];
    _.each(arguments, function(response, regionId){
      var matchIds = response.data;
      // matchIds = _.sample(matchIds, 1); // debugging purposes
      var region = regions[regionId];
      _.each(matchIds, function(matchId){
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
      _.chain(match.teams).pluck('bans').flatten().each(function(ban){
        var champion = champions.getOrCreate(ban.championId, {bans: 0});
        champion.increment('bans');
      });

      _.each(match.participants, function(participant){
        var champion = champions.getOrCreate(participant.championId, {bans: 0});
        var stats = {
          PARTICIPANT: participant.stats,
          TEAM: _.findWhere(match.teams, {teamId: participant.teamId})
        };
        var regionTier = regionTiers.getOrCreate(match.region.toLowerCase()+'_'+participant.highestAchievedSeasonTier);

        champion.updateAverages(stats);
        regionTier.updateAverages(stats);

        for(var i=0; i<=6; i++){
          var itemId = participant.stats['item'+i]
          if(itemId == 0) { continue; }

          var item = items.getOrCreate(itemId);
          item.updateAverages(stats);
        }
      });
    });

    output('saving collections');
    return Parse.Object.saveAll(collections);
  }).then(function(list){
    var totals = _.map(list, function(collection){
      return _.reduce(collection.models, function(sum, model){
        return sum+model.get('samples');
      }, 0);
    });
    console.log(totals);
    // show as much information in the short Parse job status
    status.success(numMatches + ' matches from ' + beginDate + ' (' + (new Date(beginDate*1000)).toISOString() + ') were added creating a total of ' + totals.join('/') + ' samples');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
