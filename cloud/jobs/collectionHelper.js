var _ = require('underscore');
var CONSTANTS = require('cloud/jobs/constants');

exports.getCollection = function(className){
  var Model = Parse.Object.extend(className, {
    updateAverages: function(values){
      var model = this;
      var samples = model.get("samples") || 0;
      _.each(CONSTANTS.STATS[model.className], function(keys, type){
        _.each(keys, function(key){
          var average = model.get(key) || 0;
          average += (values[type][key]-average)/(samples+1);
          model.set(key, average);
        });
      });
      this.increment('samples');
    }
  });
  var Collection = Parse.Collection.extend({
    model: Model,
    query: (new Parse.Query(Model)).limit(1000),
    getOrCreate: function(identifier, defaults){
      var model = this.find(function(collectionObject){
        return collectionObject.get("identifier") == identifier;
      });
      if(_.isUndefined(model)){
        model = new Model(_.extend({
          identifier: identifier,
          samples: 0
        }, defaults));
        var keys = _.flatten(_.map(CONSTANTS.STATS[model.className], _.values));
        _.each(keys, function(key){
          model.set(key, 0);
        });
        this.add(model);
      }
      return model;
    }
  });
  return new Collection();
};
