angular.module('Tindergram.Instagram')

.factory('intagramAPI.factory', [
  '$http',
  'apikeys.instagram',

function ($http, apiKeys) {

  var
    BASE_URI = 'https://api.instagram.com/v1',
    BASE_PARAMS = {
      client_id : apiKeys.CLIENT_ID,
      callback : 'JSON_CALLBACK'
    },
    api = {}
  ;

  api.getMediaByTagName = function getMediaByTagName (tagName) {
    var uri = BASE_URI + '/tags/' + tagName + '/media/recent';

    return $http.jsonp(uri, {
      params : BASE_PARAMS
    });
  };

  api.getMediaFromURI = function getMediaFromURI (uri) {
    return $http.jsonp(uri);
  };

  return api;

}]);
