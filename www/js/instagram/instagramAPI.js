angular.module('Instagram').factory('instagramAPI', ['instagramKeys', function (apiKeys) {

  var
    CLIENT_ID = apiKeys.CLIENT_ID,
    CLIENT_SECRET = apiKeys.CLIENT_SECRET,
    BASE_URI = 'https://api.instagram.com/v1',
    CLIENT_PARAM = 'client_id=',
    api = {}
  ;

  return api;
}]);
