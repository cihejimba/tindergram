angular.module('Tindergram.Instagram')

.factory('instagram.factory',
  ['instagram.viewModel',
  'intagramAPI.factory',
  '_',
  '$q',
function (viewModel, api, _, $q) {

  var maxTagId,
  hashtag = 'foodporn',
  CacheQueue = {};

  CacheQueue.cache = [];
  CacheQueue.callbacks = [];
  CacheQueue.fetchingData = false;

  CacheQueue.flushQueue = function () {
    if (this.callbacks.length <= 0) return;

    this.callbacks.pop()();

    this.flushQueue();
  };

  function getNextInstagram (num) {
    var
      dfd = $q.defer(),
      num = num || 1,
      result = [];

    if (CacheQueue.cache.length >= num) {
      _.times(num, function (i) {
        result.push(new viewModel(CacheQueue.cache.pop()));
      });
      console.log('USE CACHE: ', CacheQueue.cache.length);

      dfd.resolve(result);
    } else {
      CacheQueue.callbacks.push(function () {
        _.times(num, function (i) {
          result.push(new viewModel(CacheQueue.cache.pop()));
        });
        console.log('DELAYED CACHE: ', CacheQueue.cache.length);

        dfd.resolve(result);
      });

      if (CacheQueue.fetchingData === false) {
        console.log('BUILD CACHE: ', CacheQueue.cache.length);
        buildCache().then(function (newCache) {
          CacheQueue.cache = CacheQueue.cache.concat(newCache);
          console.log('CACHE BUILT: ', CacheQueue.cache.length);
          CacheQueue.flushQueue();
        });
      }
    }
    return dfd.promise;
  }

  function buildCache () {
    var dfd = $q.defer();

    CacheQueue.fetchingData = true;

    if (maxTagId) {
      api.getMediaFromMaxTagId(maxTagId).then(function(response) {
        CacheQueue.fetchingData = false;
        dfd.resolve(handleResponse(response.data));
      });
    } else {
      api.getMediaByTagName(hashtag).then(function(response) {
        CacheQueue.fetchingData = false;
        dfd.resolve(handleResponse(response.data));
      });
    }
    return dfd.promise;
  }

  function getMostLikedPhotos (instaObjects) {
    return _.shuffle(instaObjects.sort(function (instaObject) {return -1 * instaObject.likes.count}).slice(0,5));
  }

  function handleResponse (response) {
    // remove callback and client id which will be reset by api factory
    maxTagId = response.pagination.next_max_id;
    return getMostLikedPhotos(response.data).concat(CacheQueue.cache);
  }

  return {
    getNextInstagram : getNextInstagram
  };
}]);
