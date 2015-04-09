var _ = require('underscore');

// this job is useful for development purposes, unsafe otherwise
Parse.Cloud.job("resetData", function(request, status) {
  status.error("Commented out to prevent accidents");

  // Parse.Cloud.useMasterKey();
  //
  // var promises = _.map(['Champion', 'Item', 'RegionTier'], function(className){
  //   var query = new Parse.Query(className);
  //   query.limit(1000);
  //   return query.find().then(function(results){
  //     return Parse.Object.destroyAll(results);
  //   });
  // });
  //
  // Parse.Promise.when(promises).then(function(){
  //   status.success('reset data');
  // }, function(error){
  //   status.error("Error: " + error.code + " " + error.message);
  // });
});
