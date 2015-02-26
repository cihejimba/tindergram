// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Tindergram', [
  'ngAnimate',
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

  function handleDragStop (dragData, tag) {
    if (draggedEnough(dragData.deltaX)) {
      if (dragData.deltaX > 0) {
        $scope.$broadcast('next-yes-' + tag + ' | main');
      } else {
        $scope.$broadcast('next-no-' + tag + ' | main');
      }
    } else {
      $scope.$broadcast('release-' + tag + ' | main');
    }
  }

  $scope.$on('next-yes | footer', function (event, data) {
    $scope.$broadcast('next-yes-pre | main');
    $scope.$broadcast('next-yes-post | main');
  });

  $scope.$on('next-no | footer', function (event, data) {
    $scope.$broadcast('next-no-pre | main');
    $scope.$broadcast('next-no-post | main');
  });

  $scope.$on('drag | card', function (broadcastEvent, eventData) {
    // console.log('DRAG%: ' + translateDragData(eventData).deltaX / viewportWidth);

    $scope.$broadcast('drag | main', translateDragData(eventData));
  });

  $scope.$on('drag-stop-pre | card', function (broadcastEvent, eventData) {
    handleDragStop(translateDragData(eventData), 'pre');
  });

  $scope.$on('drag-stop-post | card', function (broadcastEvent, eventData) {
    handleDragStop(translateDragData(eventData), 'post');
  });
 }])

.controller('InstaCollectionCtrl', ['$scope', 'instagram.factory', function ($scope, instagramFactory) {
  function next () {

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
    instagramFactory.getNextInstagram(3).then(function(viewModels) {
      $scope.tinderCollection = viewModels;
      console.log(viewModels);
    });
  }

  $scope.tinderCollection = [];

  init();

}])

.controller('InstaCardCtrl', ['$scope', '$element', '$window', '$animate', 'common.style', '_',

function ($scope, $element, $window, $animate, style, _) {
  var
    dragState = false,
    viewportWidth = $window.innerWidth,
    elBoundingRec = $element.children()[0].getBoundingClientRect(),
    cardMidpoint = {
      x : elBoundingRec.left + (elBoundingRec.width / 2),
      y : elBoundingRec.top + (elBoundingRec.height / 2)
    },
    startY,
    INITIAL_POSITION = style.css('top', '0px', style.css('left', '0px'));

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

  function getTheta (eventData) {
    var radius = viewportWidth * 3;

    return Math.asin(eventData.deltaX / radius) * 180 / Math.PI;
  }

  function getRotation (eventData) {
    var theta = getTheta(eventData),
      upDirection = startY > cardMidpoint.y;

    return upDirection ? -1 * theta : theta;
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
    setTimeout(function () {
      $scope.cardKlass = undefined;
    }, 100);
  }

  $scope.position = resetCard();

  $scope.onDrag = function onDrag (ev) {
    var
      eventData = translateDragData(ev),
      rotation,
      target = ev.target;

    if (dragState === false) {
      while(target !== ev.currentTarget) {
        if (target.className.indexOf('card-footer') !== -1) return;

        target = target.parentElement;
      }
    }

    if (startY === undefined) startY = eventData.startY;

    rotation = getRotation(eventData);
    dragState = true;
    $scope.$emit('drag | card', ev);

    $scope.position = style.css('top', eventData.deltaY + 'px', style.css('left', eventData.deltaX + 'px', $scope.position));
    $scope.opacityLeft = style.css( 'opacity', getOpactiy(eventData.deltaX), $scope.opacityLeft);
    $scope.opacityRight = style.css('opacity', getOpactiy(-1 * eventData.deltaX), $scope.opacityRight);

    $scope.position = style.css('transform', 'rotate(' + rotation + 'deg)', $scope.position);
  };

  $scope.onRelease = function onRelease (ev) {
    ev.preventDefault();
    var
      eventData = translateDragData(ev),
      PX_TO_SLIDE = 250;

    function animateCardExit (px) {
      $animate.animate(
        $element.children(),
        _.clone($scope.position),
        style.css('left', (eventData.deltaX + px) + 'px', $scope.position),
        'release'
      ).then(function () {
        $scope.$emit('drag-stop-post | card', ev);
      });
    }

    if (dragState === true) {
      if (draggedEnough(eventData.deltaX)) {
        console.log('DRAGGED ENOUGH');

        if (eventData.deltaX > 0) {
          $scope.$emit('drag-stop-pre | card', ev);
          animateCardExit(PX_TO_SLIDE);
        } else {
          $scope.$emit('drag-stop-pre | card', ev);
          animateCardExit(-1 * PX_TO_SLIDE);
        }
      } else {
        $scope.$emit('drag-stop-pre | card', ev);
        $scope.$emit('drag-stop-post | card', ev);
      }
    }

    dragState = false;
    startY = undefined;
  };

  $scope.$on('release-post | main', function () {
    resetCard();
  });

}])

.controller('FooterCtrl', ['$scope', '$element', '$window', '$animate', 'common.style',
function ($scope, $element, $window, $animate, style) {
  var
    viewportWidth = $window.innerWidth,
    touchState = false,
    RELEASE_CLASS = 'release',
    TOUCH_CLASS = 'touch',
    BUTTON_DATA = 'data-type',
    DRAG_CLASS = 'drag',
    BASE_BUTTON_STYLE = style.css('transform', 'scale(1)');

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
    $scope.scaleYes = style.css('transform', 'scale(' + getScale(eventData.deltaX) + ')', $scope.scaleYes);
    $scope.scaleNo =  style.css('transform', 'scale(' + getScale(-1 * eventData.deltaX) + ')', $scope.scaleNo);
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

    next($event.target.getAttribute(BUTTON_DATA));
  }

  function resetButtonScale (scope) {
    animateButtonShrink(scope);
  }

  function animateButtonShrink (data) {
    var scope = 'scale' + data.charAt(0).toUpperCase() + data.substring(1).toLowerCase();
    debugger;
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
