// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Tindergram', [
  'ionic',
  'Tindergram.Instagram']
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

.controller('InstaCardCtrl', ['$scope', '$element', '$window', function ($scope, $element, $window) {
  var
    dragState = false,
    viewportWidth = $window.innerWidth,
    INITIAL_POSITION = {left : '0px', top : '0px'};

  $scope.position = INITIAL_POSITION;

  function translateDragData (eventData) {
    return {
      startX : eventData.gesture.center.pageX,
      startY : eventData.gesture.center.pageY,
      deltaX : eventData.gesture.deltaX,
      deltaY : eventData.gesture.deltaY
    };
  }

  function getOpactiy (deltaX) {
    var
      maxOpacity = 1,
      minOpactiy = 0,
      calculatedOpacity = (deltaX / viewportWidth) * 7;

    return [maxOpacity, minOpactiy, calculatedOpacity].sort()[1];
  }

  function setOpacity (opacity) {
    return { opacity : opacity };
  }

  function resetCard () {
    $scope.position = INITIAL_POSITION;
    $scope.opacityLeft = 0;
    $scope.opacityRight = 0;
  }

  $scope.onDrag = function onDrag (ev) {
    var eventData = translateDragData(ev);
    dragState = true;
    $scope.$emit('drag | card', ev);

    $scope.position = { left : eventData.deltaX + 'px', top: eventData.deltaY + 'px'};
    $scope.opacityLeft = setOpacity(getOpactiy(eventData.deltaX));
    $scope.opacityRight = setOpacity(getOpactiy(-1 * eventData.deltaX));

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

.controller('FooterCtrl', ['$scope', '$element', '$window', function ($scope, $element, $window) {
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
    $scope.scaleYes = setButtonScale(getScale(-1 * eventData.deltaX));
    $scope.scaleNo = setButtonScale(getScale(eventData.deltaX));
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
