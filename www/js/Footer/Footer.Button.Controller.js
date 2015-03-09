angular.module('Tindergram.Footer')

.controller('Tindergram.Footer.Button.Ctrl', ['$scope', '$element', '$animate', 'common.style',

function ($scope, $element, $animate, style) {
  // $scope.buttonModel = {
  //   klassList : 'button-assertive close-button',
  //   iconKlassList : 'ion-close',
  //   type : 'no'
  // }

  var
    touchState = false,
    RELEASE_CLASS = 'release',
    TOUCH_CLASS = 'touch',
    BUTTON_DATA = 'data-type',
    DRAG_CLASS = 'drag',
    BASE_BUTTON_STYLE = style.css('transform', 'scale(1)');

  function next () {
    $scope.$emit('next-' + $scope.buttonModel.type + ' | footer');
  }

  function addClass (klass, klassList) {
    if (klassList.indexOf(klass) > -1) {
      return;
    } else {
      return klassList + ' ' + klass;
    }
  }

  function removeClass (klass, klassList) {
    var index = klassList.indexOf(klass);
    if (index > -1) {

      // return klassList.substring(0, index) + klassList.substring(index + klass.length, klassList.length);
    } else {
      return klassList;
    }
  }

  function handleDragEvent (broadcastEvent, eventData) {
    $scope.scaleYes = style.css('transform', 'scale(' + dragMath.getScale(eventData.deltaX) + ')', $scope.scaleYes);
    $scope.scaleNo =  style.css('transform', 'scale(' + dragMath.getScale(-1 * eventData.deltaX) + ')', $scope.scaleNo);
    $scope.buttonKlass = DRAG_CLASS;
  }

  function handleDragStopEvent (event, scopes) {
    $scope.buttonKlass = undefined;

    _.each(scopes, function (scope) {
      resetButtonScale(scope);
    });
  }

  function handleTouchEvent ($event) {
    $event.target.classList.add(TOUCH_CLASS);
    touchState = true;
  }

  function handleReleaseEvent ($event) {
    if (touchState !== true) return;

    $event.target.classList.remove(TOUCH_CLASS);

    next();
  }

  $scope.$on('drag | main', handleDragEvent);

  $scope.$on('release-pre | main', function (ev) {
    handleDragStopEvent(ev, ['yes', 'no']);
  });
  $scope.$on('next-yes-pre | main', function(ev) {
    handleDragStopEvent(ev, ['yes']);
  });
  $scope.$on('next-no-pre | main', function (ev) {
    handleDragStopEvent(ev, ['no']);
  });


  $scope.onTouch = handleTouchEvent;
  $scope.onRelease = handleReleaseEvent;
}]);
