var _ = require('underscore');

exports.getCollection = function(className){
  var Model = Parse.Object.extend(className, {
    updateAverage: function(stat, value){
      var average = this.get(stat) || 0;
      var samples = this.get("samples") || 0;
      average += (value-average)/(samples+1);
      this.set(stat, average);
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
