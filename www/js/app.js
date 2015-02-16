// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Tindergram', [
  'ionic',
  'Tindergram.Instagram',
  'Style']
)

.controller('MainCtrl', ['$scope', '$window', function ($scope, $window) {
  var viewportWidth = $window.innerWidth;

  function translateDragData (eventData) {
    return {
      startX : eventData.gesture.center.pageX,
      startY : eventData.gesture.center.pageY,
      deltaX : eventData.gesture.deltaX,
      deltaY : eventData.gesture.deltaY
    };
  }

  function draggedEnough (deltaX) {
    return Math.abs(deltaX) / viewportWidth > 0.4;
  }

  function handleDragStop (dragData) {
    if (draggedEnough(dragData.deltaX)) {
      if (dragData.deltaX > 0) {
        $scope.$broadcast('next-yes | main');
      } else {
        $scope.$broadcast('next-no | main');
      }
    } else {
      $scope.$broadcast('release | main');
    }
  }

  $scope.$on('next-yes | footer', function (event, data) {
    $scope.$broadcast('next-yes | main');
  });

  $scope.$on('next-no | footer', function (event, data) {
    $scope.$broadcast('next-no | main');
  });

  $scope.$on('drag | card', function (broadcastEvent, eventData) {
    // console.log('DRAG%: ' + translateDragData(eventData).deltaX / viewportWidth);

    $scope.$broadcast('drag | main', translateDragData(eventData));
  });

  $scope.$on('drag-stop | card', function (broadcastEvent, eventData) {
    handleDragStop(translateDragData(eventData));
  });
 }])

.controller('InstaCollectionCtrl', ['$scope', 'instagram.factory', function ($scope, instagramFactory) {
  function next () {

    $scope.tinderCollection.shift();

    instagramFactory.getNextInstagram().then(function (viewModels) {
      $scope.tinderCollection.push(viewModels[0]);
    });
  };

  $scope.$on('next-yes | main', function (event, data) {
    if ($scope.tinderCollection.length <= 0) return;
    next();
  });

  $scope.$on('next-no | main', function (event, data) {
    if ($scope.tinderCollection.length <= 0) return;
    next();
  });

  function init () {
    instagramFactory.getNextInstagram(3).then(function(viewModels) {
      $scope.tinderCollection = viewModels;
      console.log(viewModels);
    });
  }

  $scope.tinderCollection = [];

  init();

}])

.controller('InstaCardCtrl', ['$scope', '$element', '$window', 'common.style', '_',

function ($scope, $element, $window, style, _) {
  var
    dragState = false,
    viewportWidth = $window.innerWidth,
    elBoundingRec = $element.children()[0].getBoundingClientRect(),
    cardMidpoint = {
      x : elBoundingRec.left + (elBoundingRec.width / 2),
      y : elBoundingRec.top + (elBoundingRec.height / 2)
    },
    INITIAL_POSITION = style.css('top', '0px', style.css('left', '0px'));

  function translateDragData (eventData) {
    return {
      startX : eventData.gesture.center.pageX,
      startY : eventData.gesture.center.pageY,
      deltaX : eventData.gesture.deltaX,
      deltaY : eventData.gesture.deltaY
    };
  }

  function getTheta (eventData) {
    var radius = viewportWidth * 3;

    return Math.asin(eventData.deltaX / radius) * 180 / Math.PI;
  }

  function getRotation (eventData, upDirection) {
    var theta = getTheta(eventData);

    if (upDirection === undefined) upDirection = true;
    console.log(theta);
    return upDirection ? theta : -1 * theta;

    return 0;
  }

  function getOpactiy (deltaX) {
    var
      maxOpacity = 1,
      minOpactiy = 0,
      calculatedOpacity = (deltaX / viewportWidth) * 7;

    return [maxOpacity, minOpactiy, calculatedOpacity].sort()[1];
  }

  function resetCard () {
    $scope.position = _.clone(INITIAL_POSITION);
    $scope.opacityLeft =  style.css('opacity', 0, $scope.opacityLeft);
    $scope.opacityRight = style.css('opacity', 0, $scope.opacityRight);
  }

  $scope.position = resetCard();

  $scope.onDrag = function onDrag (ev) {
    var
      eventData = translateDragData(ev),
      rotation = getRotation(eventData);

    dragState = true;
    $scope.$emit('drag | card', ev);

    $scope.position = style.css('top', eventData.deltaY + 'px', style.css('left', eventData.deltaX + 'px', $scope.position));
    $scope.opacityLeft = style.css( 'opacity', getOpactiy(eventData.deltaX), $scope.opacityLeft);
    $scope.opacityRight = style.css('opacity', getOpactiy(-1 * eventData.deltaX), $scope.opacityRight);

    $scope.position = style.css('transform', 'rotate(' + rotation + 'deg)', $scope.position);

  };

  $scope.onRelease = function onRelease (ev) {
    if (dragState === true) $scope.$emit('drag-stop | card', ev);

    dragState = false;
  };

  $scope.$on('release | main', function () {
    resetCard();
  });

  // $scope.$on('drag | main', function (broadcastEvent, eventData) {
  //   // debugger;
  //   console.log(JSON.stringify({ left : eventData.deltaX , top: eventData.deltaY }));
  //   $scope.position = { left : eventData.deltaX + 'px', top: eventData.deltaY + 'px'};
  // });
}])

.controller('FooterCtrl', ['$scope', '$element', '$window', 'common.style',
function ($scope, $element, $window, style) {
  var
    viewportWidth = $window.innerWidth,
    touchState = false,
    RELEASE_CLASS = 'release',
    TOUCH_CLASS = 'touch',
    BUTTON_DATA = 'data-type',
    DRAG_CLASS = 'drag';

  // $scope.scaleYes, $scope.scaleNo

  function next (direction) {
    $scope.$emit('next-' + direction + ' | footer');
  }

  function getScale (deltaX) {
    var
      maxScale = 1.5,
      minScale = 1,
      calculatedScale = 1 + (deltaX / viewportWidth);

   return [maxScale, minScale, calculatedScale].sort()[1];
  }

  function setButtonScale (scale) {
    return { transform : 'scale(' + scale + ')' };
  }

  function handleDragEvent (broadcastEvent, eventData) {
    $scope.scaleYes = style.css('transform', 'scale(' + getScale(-1 * eventData.deltaX) + ')', $scope.scaleYes);
    $scope.scaleNo =  style.css('transform', 'scale(' + getScale(eventData.deltaX) + ')', $scope.scaleNo);
    // console.log('NO-scale: ', setButtonScale(getScale(eventData.deltaX)));
    $element.find('button').addClass(DRAG_CLASS);
  }

  function handleDragStopEvent () {
    $element.find('button').addClass(DRAG_CLASS);
    resetButtonScale();
  }

  function handleTouchEvent ($event) {
    $event.target.classList.add(TOUCH_CLASS);
    touchState = true;
  }

  function handleReleaseEvent ($event) {
    if (touchState !== true) return;

    $event.target.classList.remove(TOUCH_CLASS);
    $event.target.classList.add(RELEASE_CLASS);

    next($event.target.getAttribute(BUTTON_DATA));

    $window.setTimeout(function () {
      $event.target.classList.remove(RELEASE_CLASS);
    }, 500);
  }

  function resetButtonScale () {
    $scope.scaleYes = undefined;
    $scope.scaleNo = undefined;
  }

  $scope.$on('drag | main', handleDragEvent);
  $scope.$on('release | main', handleDragStopEvent);
  $scope.$on('next-yes | main', handleDragStopEvent);
  $scope.$on('next-no | main', handleDragStopEvent);

  $scope.onTouch = handleTouchEvent;
  $scope.onRelease = handleReleaseEvent;
}])

.directive('tinderCollection', function () {
  return {
    restrict: 'E',
    controller: 'InstaCollectionCtrl',
    scope: {
      tinderCollection: '='
    },
    templateUrl : 'templates/tinderCollection.html'
  };
})

.directive('tinderCard', function () {
  return {
    restrict: 'E',
    controller: 'InstaCardCtrl',
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
