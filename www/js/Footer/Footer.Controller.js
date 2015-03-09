angular.module('Tindergram.Footer')

.controller('Tindergram.Footer.Ctrl', ['$scope', '$element', '$animate', 'common.style',

function ($scope, $element, $animate, style) {
  var
    touchState = false,
    RELEASE_CLASS = 'release',
    TOUCH_CLASS = 'touch',
    BUTTON_DATA = 'data-type',
    DRAG_CLASS = 'drag',
    BASE_BUTTON_STYLE = style.css('transform', 'scale(1)');

  function resetButtonScale (scope) {
    animateButtonShrink(scope);
  }

  function animateButtonShrink (data) {
    var scope = 'scale' + data.charAt(0).toUpperCase() + data.substring(1).toLowerCase();
    $animate.animate(
      $element.children(),
      _.clone($scope[scope]),
      BASE_BUTTON_STYLE,
      RELEASE_CLASS
    ).then(function () {
      console.log(scope);
      $scope[scope] = undefined;
    });
  }

  $scope.buttonCollection = [
    {
      klassList : 'button-assertive close-button',
      iconKlassList : 'ion-close',
      type : 'no'
    }, {
      klassList : 'button-balanced like-button',
      iconKlassList : 'ion-ios-heart-outline',
      type : 'yes'
    }
  ];

}]);
