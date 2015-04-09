var _ = require('underscore');

Parse.Cloud.job("sandbox", function(request, status) {
  Parse.Cloud.useMasterKey();

  var gameScores = [];

  var GameScore = Parse.Object.extend("GameScore");

  for(var i=0; i<100; i++){
    var gameScore = new GameScore();
    for(var j=0; j<100; j++){
      gameScore.set("test" + j, i*j);
    }
    gameScores.push(gameScore);
  }

  Parse.Object.saveAll(gameScores, {
    success: function(gameScore) {
      status.success('Created gamescores');
    },
    error: function(error) {
      status.error('Failed to create new object, with error code: ' + error.message);
    }
  });
});
