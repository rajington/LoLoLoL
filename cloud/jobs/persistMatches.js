var _ = require('underscore');
var CONSTANTS = require('cloud/jobs/constants');

Parse.Cloud.job("persistMatches", function(request, status) {
  Parse.Cloud.useMasterKey();
  var Matches = Parse.Object.extend("Matches");

  // variables that persist across promises
  var RIOT_API_KEY;
  var matches;

  Parse.Config.get().then(function(config){
    RIOT_API_KEY = config.get('RIOT_API_KEY');
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
          return new Matches({
            region: region,
            matches: response.data,
            date: new Date(beginDate*1000)
          });
        })
      );
    });
    return Parse.Promise.when(promises);
  }).then(function(){
    return Parse.Object.saveAll(_.toArray(arguments));
  }).then(function(){
    status.success('Added matches');
  }, function(error){
    status.error("Error: " + error.code + " " + error.message);
  });
});
