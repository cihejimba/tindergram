angular.module('Tindergram.Collection')

.directive('tindergramCollection', function () {
  return {
    restrict: 'E',
    controller: 'Tindergram.Collection.Ctrl',
    // scope: {
    //   viewCollection: '='
    // },
    templateUrl : 'templates/tindergramCollection.html'
  };
});
