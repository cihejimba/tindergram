angular.module('Tindergram.Instagram')

.factory('instagram.viewModel', [

function () {
  var viewModel = function instagramViewModel (dataModel) {
    this.caption = getData(dataModel, ['caption', 'text']);
    this.comments = getData(dataModel, ['comments', 'data']);
    this.createdDate = new Date(getData(dataModel, ['created_time']) * 1000);
    this.imageUrl = getData(dataModel, ['images', 'standard_resolution', 'url']);
    this.likeCount = getData(dataModel, ['likes', 'count']);
    this.locationName = getData(dataModel, ['location', 'name']);
  };

  function getData (data, path) {
    if (data && path && path.length && path.length > 0 && data[path[0]]) {
      return path.length > 1 ? getData(data[path[0]], path.slice(1, path.length)) : data[path[0]];
    }
    return null;
  }

  return viewModel;
}]);
