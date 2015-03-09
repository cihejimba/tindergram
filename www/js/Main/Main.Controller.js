angular.module('Tindergram.Main')

.controller('Tindergram.Main.Ctrl', ['$scope', '$window', 'dragMath', function ($scope, $window, dragMath) {
  function handleDragStop (dragData, tag) {
    if (dragMath.draggedEnough(dragData.deltaX)) {
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
    $scope.$broadcast('drag | main', dragMath.translateDragData(eventData));
  });

  $scope.$on('drag-stop-pre | card', function (broadcastEvent, eventData) {
    handleDragStop(dragMath.translateDragData(eventData), 'pre');
  });

  $scope.$on('drag-stop-post | card', function (broadcastEvent, eventData) {
    handleDragStop(dragMath.translateDragData(eventData), 'post');
  });
}]);
