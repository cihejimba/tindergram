angular.module('Tindergram.Instagram')

.factory('intagramAPI.factory', [
  '$http',
  'apikeys.instagram',
  '_',

function ($http, apiKeys, _) {

  var
    BASE_URI = 'https://api.instagram.com/v1',
    DEFAULT_TAG = 'foodporn',
    tagName = DEFAULT_TAG,
    BASE_PARAMS = {
      client_id : apiKeys.CLIENT_ID,
      callback : 'JSON_CALLBACK'
    },
    api = {}
  ;

  function fullTagUri () {
    return BASE_URI + '/tags/' + tagName + '/media/recent';
  }

  api.getMediaByTagName = function getMediaByTagName (newTagName) {
    if (newTagName) tagName = newTagName;

    return $http.jsonp(fullTagUri(), {
      params : BASE_PARAMS
    });
  };

  api.getMediaFromMaxTagId = function getMediaFromMaxTagId (maxTagId) {
    return $http.jsonp(fullTagUri(), {
      params : _.extend(BASE_PARAMS, {max_tag_id : maxTagId})
    });
  };

  return api;

}]);
