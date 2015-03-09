angular.module('Tindergram.Collection')

.controller('Tindergram.Collection.Ctrl', ['$scope', 'instagram.factory', function ($scope, instagramFactory) {
  function next () {
    console.log('shift');
    $scope.tinderCollection.shift();

    instagramFactory.getNextInstagram().then(function (viewModels) {
      $scope.tinderCollection.push(viewModels[0]);
    });
  };

  $scope.$on('next-yes-post | main', function (event, data) {
    if ($scope.tinderCollection.length <= 0) return;
    next();
  });

  $scope.$on('next-no-post | main', function (event, data) {
    if ($scope.tinderCollection.length <= 0) return;
    next();
  });

  function init () {
    $scope.tinderCollection = [];

    instagramFactory.getNextInstagram(3).then(function(viewModels) {
      $scope.viewCollection = viewModels;
    });
  }

  init();

}]);
