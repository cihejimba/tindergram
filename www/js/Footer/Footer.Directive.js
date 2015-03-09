angular.module('Tindergram.Footer')

.directive('tindergramFooter', function () {
  return {
    restrict: 'E',
    controller: 'Tindergram.Footer.Ctrl',
    scope: {},
    templateUrl : 'templates/tindergramFooter.html'
  };
});
