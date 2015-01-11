// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('tindergram', ['ionic'])

.controller('MainCtrl', ['$scope', function ($scope) {

}])
.controller('InstagramCtrl', ['$scope', function ($scope) {
  var tinderCollection = [
    { name : 'kyle'},
    { name : 'Bob'}
  ];
  $scope.tinderCollection = tinderCollection;
}])

.directive('tinderCollection', function () {
  return {
    restrict: 'E',
    scope: {
      tinderCollection: '='
    },
    templateUrl : 'templates/tinderCollection.html'
  };
})

.directive('tinderCard', function () {
  return {
    restrict: 'E',
    scope: {
      viewModel: '='
    },
    templateUrl : 'templates/tinderCard.html'
  };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
