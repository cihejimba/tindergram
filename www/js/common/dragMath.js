angular.module('DragMath', [])

.factory('dragMath', ['$window', function($window) {
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

  // private
  function getTheta (eventData) {
    var radius = viewportWidth * 3;

    return Math.asin(eventData.deltaX / radius) * 180 / Math.PI;
  }

  function getRotation (eventData, startY, cardMidpoint) {
    var
      theta = getTheta(eventData),
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

  function getScale (deltaX) {
    var
      maxScale = 1.5,
      minScale = 1,
      calculatedScale = 1 + (deltaX / viewportWidth);

   return [maxScale, minScale, calculatedScale].sort()[1];
  }

  return {
    translateDragData : translateDragData,
    draggedEnough     : draggedEnough,
    getRotation       : getRotation,
    getOpactiy        : getOpactiy,
    getScale          : getScale
  };

}]);
