angular.module('Tindergram.Card')

.controller('Tindergram.Card.Ctrl', ['$scope', '$element', '$animate', 'common.style', '_', 'dragMath',

function ($scope, $element, $animate, style, _, dragMath) {
  var
    dragState = false,
    elBoundingRec = $element.children()[0].getBoundingClientRect(),
    cardMidpoint = {
      x : elBoundingRec.left + (elBoundingRec.width / 2),
      y : elBoundingRec.top + (elBoundingRec.height / 2)
    },
    startY,
    INITIAL_POSITION = style.css('top', '0px', style.css('left', '0px'));

  function resetCard () {
    $scope.position = _.clone(INITIAL_POSITION);
    $scope.opacityLeft =  style.css('opacity', 0, $scope.opacityLeft);
    $scope.opacityRight = style.css('opacity', 0, $scope.opacityRight);
    setTimeout(function () {
      $scope.cardKlass = undefined;
    }, 100);
  }

  $scope.onDrag = function onDrag (ev) {
    var
      eventData = dragMath.translateDragData(ev),
      rotation,
      target = ev.target;

    if (dragState === false) {
      while(target !== ev.currentTarget) {
        if (target.className.indexOf('card-footer') !== -1) return;

        target = target.parentElement;
      }
    }

    if (startY === undefined) startY = eventData.startY;

    rotation = dragMath.getRotation(eventData, startY, cardMidpoint);
    dragState = true;
    $scope.$emit('drag | card', ev);

    $scope.position = style.css('top', eventData.deltaY + 'px', style.css('left', eventData.deltaX + 'px', $scope.position));
    $scope.opacityLeft = style.css( 'opacity', dragMath.getOpactiy(eventData.deltaX), $scope.opacityLeft);
    $scope.opacityRight = style.css('opacity', dragMath.getOpactiy(-1 * eventData.deltaX), $scope.opacityRight);

    $scope.position = style.css('transform', 'rotate(' + rotation + 'deg)', $scope.position);
  };

  $scope.onRelease = function onRelease (ev) {
    ev.preventDefault();
    var
      eventData = dragMath.translateDragData(ev),
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
      if (dragMath.draggedEnough(eventData.deltaX)) {
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

  $scope.position = resetCard();

}]);
