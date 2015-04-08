var _ = require('underscore');

exports.getCollection = function(className){
  var Model = Parse.Object.extend(className, {
    updateAverages: function(stats, values){
      var model = this;
      var samples = model.get("samples") || 0;
      _.each(stats, function(stat){
        var average = model.get(stat) || 0;
        average += (values[stat]-average)/(samples+1);
        model.set(stat, average);
      });
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
          identifier: identifier
        });
        this.add(model);
      }
      return model;
    }
  });
  return new Collection();
};
