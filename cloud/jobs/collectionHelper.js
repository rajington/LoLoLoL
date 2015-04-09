var _ = require('underscore');

exports.getCollection = function(className){
  var Model = Parse.Object.extend(className, {
    updateAverages: function(typedKeys, values){
      var model = this;
      var samples = model.get("samples") || 0;
      _.each(typedKeys, function(keys, type){
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
    getOrCreate: function(identifier){
      var model = this.find(function(collectionObject){
        return collectionObject.get("identifier") == identifier;
      });
      if(_.isUndefined(model)){
        model = new Model({
          identifier: identifier,
          samples: 0
        });
        this.add(model);
      }
      return model;
    }
  });
  return new Collection();
};
