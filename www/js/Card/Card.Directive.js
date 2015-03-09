angular.module('Tindergram.Card')

.directive('tindergramCard', function () {
  return {
    restrict: 'E',
    controller: 'Tindergram.Card.Ctrl',
    scope: {
      viewModel: '='
    },
    templateUrl : 'templates/tindergramCard.html'
  };
});
