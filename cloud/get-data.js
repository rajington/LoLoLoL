var _ = require('cloud/vendor/underscore');

var collections = {
  champions: {
    collectionName: 'Champion',
    addTotal: true,
    riot: {
      endpoint: 'champion',
      params: {
        champData: 'image'
      }
    }
  },
  items: {
    collectionName: 'Item',
    addTotal: true,
    riot: {
      endpoint: 'item',
      params: {
        itemListData: 'image'
      }
    }
  },
  regionTiers: {
    collectionName: 'RegionTier',
    addTotal: true
  },
  metrics: {
    collectionName: 'Metric'
  }
}

var getParseData = function(collectionName){
  var query = new Parse.Query(collectionName);
  query.limit(1000); // maximum limit
  return query.collection().fetch().then(function(results){
    return results.toJSON();
  });
};

var addRiotData = function(collection, name, params){
  return Parse.Config.get().then(function(config){
    return config.get('RIOT_API_KEY');
  }).then(function(RIOT_API_KEY){
    params = _.extend(params, {api_key: RIOT_API_KEY});
    return Parse.Cloud.httpRequest({
      url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/' + name,
      params: params
    });
  }).then(function(response){
    return _.toArray(response.data.data);
  }).then(function(riotData){
    _.each(collection, function(obj){
      var riotObj = _.findWhere(riotData, {id: obj.identifier});
      obj[name] = riotObj.name;
      obj.image = riotObj.image.full;
    });
    return collection;
  });
};

module.exports = exports = getData = function(collectionIdentifier){
  var collectionInfo = collections[collectionIdentifier];
  var promise = getParseData(collectionInfo.collectionName);

  if(collectionInfo.addTotal){
    promise = promise.then(function(collection){
      _.each(collection, function(obj){
        obj.sentientKills = obj.neutralMinionsKilled
          + obj.minionsKilled
          + obj.dragonKills
          + obj.baronKills;
      });
      return collection;
    });
  }

  if(collectionInfo.riot){
    var collection;
    promise = promise.then(function(collection){
      return addRiotData(collection, collectionInfo.riot.endpoint, collectionInfo.riot.params);
    });
  }

  if(collectionIdentifier == 'regionTiers'){
    promise = promise.then(function(regionTiers){
      _.each(regionTiers, function(regionTier){
        regionTier.regionTier = regionTier.identifier.toLowerCase().split('_');
      });
      return regionTiers;
    });
  }

  if(collectionIdentifier == 'champions'){
    promise = promise.then(function(champions){
      var totalSamples = _.reduce(champions, function(memo, champion){ return memo + champion.samples; }, 0);
      _.each(champions, function(champion){
        champion.pickRate = champion.samples / totalSamples;
        champion.banRate = champion.bans / totalSamples;
      });
      return champions;
    });
  }
  return promise;
}
