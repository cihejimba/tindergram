angular.module('Tindergram.Footer')

.directive('tindergramFooterButton', function () {
  return {
    restrict: 'E',
    controller: 'Tindergram.Footer.Button.Ctrl',
    scope: {
      buttonModel: '='
    },
    templateUrl : 'templates/tindergramFooterButton.html'
  }
});
