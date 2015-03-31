// Services -------------------------------------------------------------------

angular.module('myApp.services', ['ngResource'])
  .constant('moment', window.moment)
  .factory('sprintService', [
    '$http',
    '$rootScope',
    'config',
    function($http, $rootScope, config) {
      var service = {};
      service.sprints = [];
      service.refresh = function() {
        $http
          .get('/api/sprints')
          .success(function(data) {
            service.sprints = data;
            $rootScope.$broadcast('sprintRefresh', service.sprints);
          });
      };
      service.getSprint = function(id) {
        return $http.get('/api/sprint/' + id);
      };
      service.getArchived = function() {
        return $http.get('/api/sprints', {
          params: {
            archived: true,
            limit: 100
          }
        });
      };
      service.newBugUrl = function (whiteboard, defaultComponent) {
        var link = 'https://bugzilla.redhat.com/enter_bug.cgi?status_whiteboard=' + encodeURIComponent(whiteboard);

        if (defaultComponent) {
          link += ('&component=' + encodeURIComponent(defaultComponent));
        }
        return link;
      };
      service.archive = function(id, cb) {
        return function() {
          $http
          .put('/api/sprint/' + id, {
            archived: true
          })
          .success(cb);
        };
      };
      return service;
    }
  ])
  .factory('bzService', [
    '$http',
    'config',
    function ($http, config) {
      var service = {};
      service.getBugs = function(params, cb) {
        $http({
            method: 'GET',
            url: '/bugs',
            params: JSON.parse(params)
          })
          .success(cb);
      };
      return service;
    }
  ]);
