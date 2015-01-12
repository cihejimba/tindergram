angular.module('Tindergram.Instagram')

.factory('instagram.factory',
  ['instagram.viewModel',
  'intagramAPI.factory',
  '_',
  '$q',
function (viewModel, api, _, $q) {

  var cache = [],
  nextUri,
  hashtag = 'foodporn',
  buildingCache = false;

  function getNextInstagram (num) {
    var
      dfd = $q.defer(),
      num = num || 1;

    if (cache.length > num) {
      var result = [];
      _.times(num, function (i) {
        result.push(new viewModel(cache.pop()));
      });
      dfd.resolve(result);
    } else if (cache.length === num) {
      result = [];
      _.times(num, function (i) {
        result.push(new viewModel(cache.pop()));
      });
      buildCache();
      dfd.resolve(result);
    } else {
      buildCache().then(function () {
        var result = [];
        _.times(num, function (i) {
          result.push(new viewModel(cache.pop()));
        });
        dfd.resolve(result);
      });
    }
    return dfd.promise;
  }

  function buildCache () {
    var dfd = $q.defer();

    if (nextUri) {
      api.getMediaFromURI(nextUri).then(function(response) {
        handleResponse(response.data);
        dfd.resolve();
      });
    } else {
      api.getMediaByTagName(hashtag).then(function(response) {
        handleResponse(response.data);
        dfd.resolve();
      });
    }
    return dfd.promise;
  }

  function getMostLikedPhotos (instaObjects) {
    return _.shuffle(instaObjects.sort(function (instaObject) {return -1 * instaObject.likes.count}).slice(0,5));
  }

  function handleResponse (response) {
    nextUri = response.pagination.next_url;
    cache = getMostLikedPhotos(response.data).concat(cache);
  }

  return {
    getNextInstagram : getNextInstagram
  };
}]);
