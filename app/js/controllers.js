// Controllers ----------------------------------------------------------------

angular.module('myApp.controllers', [])
  .controller('topCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    'sprintService',
    'config',
    function ($scope, $rootScope, $http, sprintService, config) {
      $scope.$on('sprintRefresh', function (event, sprints) {
        $scope.sprints = sprints;
      });
    }
  ])
  .controller('sidebarCtrl', [
    '$scope',
    '$http',
    '$rootScope',
    'sprintService',
    'config',
    function ($scope, $http, $rootScope, sprintService, config) {

      $scope.$on('sprintRefresh', function (event, sprints) {
        $scope.sprints = sprints;
      });
      sprintService.refresh();

    }
  ])
  .controller('HomeCtrl', ['$scope', '$http', 'localStorageService',
    function ($scope, $http, localStorageService) {
      $scope.flagList = function (flags) {
        return flags.map(function (flag) {
          return flag.setter;
        }).join(', ');
      };

      $scope.bugzillaEmail = localStorageService.get('bugzilla_email');

      $scope.$watch('bugzillaEmail', function() {
        localStorageService.set('bugzilla_email', $scope.bugzillaEmail);
      });

      $scope.onEmailChange = function (email) {
         $http({
            method: 'GET',
            url: '/flags',
            params: {
              user: email
            }
          })
          .success(function (data) {
            $scope.flags = data;
          });
      };

      // Init
      $scope.onEmailChange($scope.bugzillaEmail);
    }
  ])
  .controller('AddCtrl', ['$scope', '$http', 'moment', 'sprintService',
    function($scope, $http, moment, sprintService) {

      $scope.pageTitle = 'Add Sprint';
      $scope.submitLabel = 'Create sprint';

      // The default dueDate should be today

      function reset() {
        $scope.new = {
          dueDate: moment().day('Friday').toDate()
        };
      }

      reset();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
         'year-format': "'yy'",
         'show-weeks': false
       };

       $scope.submit = function() {

        // Set the time of the due date to 4:00PM Eastern, which is when our demos are
        $scope.new.dueDate = moment($scope.new.dueDate).hour(16).startOf('hour').toDate();

        // Extracting query parameters from bugzilla URL
        $scope.new.params = $scope.new.params.split("?")[1];
        var query = $scope.new.params.split("%20").join(" ").split("&")
          , params = { limit: 100 };

        for (var i in query) {
          var param = query[i].split("=");
          if (!params[param[0]]) {
            params[param[0]] = []
          }
          params[param[0]].push(param[1]);
        };
        delete params.query_format;
        $scope.new.params = JSON.stringify(params);

        $http
          .post('/api/sprint', $scope.new)
          .success(function(data) {
            reset();
            sprintService.refresh();
          })
          .error(function(err) {
            console.log(err);
          });
       };

       $scope.activeTab = 'bugzilla';

    }
  ])
.controller('UpdateCtrl', ['$scope', '$http', '$routeParams', '$location', 'moment', 'sprintService',
  function($scope, $http, $routeParams, $location, moment, sprintService) {

    $scope.pageTitle = 'Edit Sprint';
    $scope.submitLabel = 'Update sprint';

    sprintService
      .getSprint($routeParams.id)
      .success(function (data) {
        $scope.new = data;
      });

    $scope.cancel = function () {
      $location.path('/sprint/' + $routeParams.id);
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
       'year-format': "'yy'",
       'show-weeks': false
     };

     $scope.submit = function() {
      $http
        .put('/api/sprint/' + $routeParams.id, $scope.new)
        .success(function(data) {
          sprintService.refresh();
          $location.path('/sprint/' + $routeParams.id);
        })
        .error(function(err) {
          console.log(err);
        });
     };

     $scope.activeTab = 'bugzilla';

  }
])
  .controller('SprintCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'sprintService', 'bzService',

    function($scope, $http, $rootScope, $routeParams, sprintService, bzService) {

      $scope.m = {};
      $scope.bugs = [];
      $scope.complete = {};

      $scope.archive = sprintService.archive($routeParams.id, function (data) {
        $scope.m = data
      });

      $scope.delete = sprintService.delete($routeParams.id, function (data) {
        $scope.m = data
      });

      $scope.getBugs = function() {
        $scope.bugs = [];
        bzService.getBugs($scope.m.params, function (data) {
          $scope.bugs = data;
          $scope.filtered_bugs = data;
          console.log(data);
          $scope.whiteboard = "";
          $scope.component = "";
          $scope.assigned_to = "";
          $scope.status = "";
          // Multiple filter criteria, Split by commas in the input boxes
          $scope.filter_bug = function () {
            // Splitting the whiteboard input elements.
            whiteboard_split = $scope.whiteboard.split(',');
            $scope.filtered_bugs = [];
            if($scope.whiteboard != "") {
              for (var whiteboardElement = 0; whiteboardElement < whiteboard_split.length; whiteboardElement++) {
                if (whiteboard_split[whiteboardElement] == "")
                  continue;
                for (var searchIndex = 0; searchIndex < $scope.bugs.length; searchIndex++) {
                  var returnedVal = $scope.bugs[searchIndex].whiteboard.toLowerCase().search(whiteboard_split[whiteboardElement].toLowerCase().trim());
                  if(returnedVal != -1) {
                    $scope.filtered_bugs.push($scope.bugs[searchIndex]);
                  }
                };
              };  
            }
            else {
              $scope.filtered_bugs = $scope.bugs;
            }

            // Splitting the component input elements.
            component_split = $scope.component.split(',');
            filtered_bugs_component = [];
            flag_component = false;
            if($scope.component.length != 0) {
              for (var componentElement = 0; componentElement < component_split.length; componentElement++) {
                if (component_split[componentElement] == "")
                  continue;
                for (var searchIndex = 0; searchIndex < $scope.filtered_bugs.length; searchIndex++) {
                  for (var componentIndexArr = 0; componentIndexArr < $scope.filtered_bugs[searchIndex].component.length; componentIndexArr++) {
                    var returnedVal = $scope.filtered_bugs[searchIndex].component[componentIndexArr].toLowerCase().search(component_split[componentElement].toLowerCase().trim());
                    if(returnedVal != -1) {
                      flag_component = true;
                      filtered_bugs_component.push($scope.filtered_bugs[searchIndex]);
                      break;
                    }
                  };
                };
              };
              $scope.filtered_bugs = filtered_bugs_component;
            }

            // Splitting the assignment input elements.
            var flag_assigned  = false;
            assigned_to_split = $scope.assigned_to.split(',');
            var filtered_bugs_assigned = [];
            if(!$scope.assigned_to == "") {
              for (var assignedElement = 0; assignedElement < assigned_to_split.length; assignedElement++) {
                if(assigned_to_split[assignedElement] == "")
                  continue;
                for (var assignedIndex = 0; assignedIndex < $scope.filtered_bugs.length; assignedIndex++) {
                  var assignedVal = $scope.filtered_bugs[assignedIndex].assigned_to.toLowerCase().search(assigned_to_split[assignedElement].toLowerCase().trim());
                  if(assignedVal != -1) {
                    flag_assigned = true;
                    filtered_bugs_assigned.push($scope.filtered_bugs[assignedIndex]);
                  }
                };
              };
              $scope.filtered_bugs = filtered_bugs_assigned;
            }

            // Splitting the status input element.
            var flag_status  = false;
            status_to_split = $scope.status.split(',');
            var filtered_bugs_status = [];
            if(!$scope.status == ""){
              for (var statusElement = 0; statusElement < status_to_split.length; statusElement++) {
                if(status_to_split[statusElement] == "")
                  continue;
                for (var statusIndex = 0; statusIndex < $scope.filtered_bugs.length; statusIndex++) {
                  var statusVal = $scope.filtered_bugs[statusIndex].status.toLowerCase().search(status_to_split[statusElement].toLowerCase().trim());
                  if(statusVal != -1) {
                    flag_status = true;
                    filtered_bugs_status.push($scope.filtered_bugs[statusIndex]);
                  }
                };
              };
              $scope.filtered_bugs = filtered_bugs_status;
            }
          }
          $('.selected', '#milestonesOf' + $routeParams.id).removeClass('selected');
          $('#milestonesOf' + $routeParams.id).show();

          // Caching data locally for the milestones
          data = { meta: $scope.m, bugs: data }
          localStorage.setItem($routeParams.id, JSON.stringify(data));
        });
      };

      sprintService
        .getSprint($routeParams.id)
        .success(function(data) {
          $scope.m = data;
          $rootScope.title = data.title;
          $scope.getBugs();
          $scope.newBugUrl = sprintService.newBugUrl(data.whiteboard, data.defaultComponent);
        });

      $scope.fields = [
        {
          name: 'Updated',
          bz: 'last_change_time'
        },
        {
          name: 'ID',
          bz: 'id'
        },
        {
          name: 'Bug',
          bz: 'summary'
        },
        {
          name: 'Whiteboard',
          bz: 'whiteboard',
          class: 'visible-lg'
        },
        {
          name: 'Component',
          bz: 'component'
        },
        {
          name: 'Assigned',
          bz: 'assigned_to'
        },
        {
          name: 'Status',
          bz: 'status'
        }
      ];

      var asc = '';
      var desc = '-';

      function switchDir(dir) {
        return dir === '-' ? '' : '-';
      }

      $scope.orderDir = desc;
      $scope.orderByField = 'last_change_time';
      $scope.orderByFields = ['status', $scope.orderDir + $scope.orderByField, '-assignedTo'];

      $scope.setOrderBy = function(field) {
        $scope.orderByFields = [];
        if (field === $scope.orderByField) {
          $scope.orderDir = switchDir($scope.orderDir);
        } else {
          $scope.orderByField = field;
          if (field === 'last_change_time') {
            $scope.orderDir = desc;
          } else {
            $scope.orderDir = asc;
          }
        }

        if (field !== 'status') {
          $scope.orderByFields.push('status');
        }
        $scope.orderByFields.push($scope.orderDir + $scope.orderByField);
        if ($scope.orderByField !== 'assignedTo') {
          $scope.orderByFields.push('-assignedTo');
        }
      };

      function isResolved(bug) {
        return bug.status === 'CLOSED';
      }

      $scope.$watch('bugs', function() {
        var bugsResolved = Math.floor($scope.bugs.filter(isResolved).length);
        var totalBugs =  $scope.bugs.length;
        $scope.complete = {
          percentage:  Math.round(bugsResolved / totalBugs * 100),
          resolved: bugsResolved,
          total: totalBugs
        };
        if ($scope.complete.percentage === 100) {
          $scope.hideResolved = false;
        }
      });

    }
  ])
  .controller('SubSprintCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'sprintService', 'bzService',

    function($scope, $http, $rootScope, $routeParams, sprintService, bzService) {

      $scope.cache = JSON.parse(localStorage.getItem($routeParams.id));
      $scope.bugs = $scope.cache.bugs.filter(function (bug) {
        return bug.id >= 0;
      });
      $scope.m = $scope.cache.meta;
      $scope.m.title += " " + $routeParams.milestone;
      $scope.m.whiteboard = $scope.m.whiteboard + " " + $routeParams.milestone;

      $("#milestonesOf" + $routeParams.id).show();
      $(".selected", "#milestonesOf" + $routeParams.id).removeClass("selected");
      var milestone = $("a[href='/sprint/" + $routeParams.id + "/" + $routeParams.milestone + "']");
      milestone.addClass("selected");

      $scope.fields = [
        {
          name: 'Updated',
          bz: 'last_change_time'
        },
        {
          name: 'ID',
          bz: 'id'
        },
        {
          name: 'Summary',
          bz: 'summary'
        },
        {
          name: 'Whiteboard',
          bz: 'whiteboard',
          class: 'visible-lg'
        },
        {
          name: 'Assigned',
          bz: 'assigned_to'
        },
        {
          name: 'Status',
          bz: 'status'
        }
      ];

      var asc = '';
      var desc = '-';

      function switchDir(dir) {
        return dir === '-' ? '' : '-';
      }

      $scope.orderDir = desc;
      $scope.orderByField = 'last_change_time';
      $scope.orderByFields = ['status', $scope.orderDir + $scope.orderByField, '-assignedTo'];

      $scope.setOrderBy = function(field) {
        $scope.orderByFields = [];
        if (field === $scope.orderByField) {
          $scope.orderDir = switchDir($scope.orderDir);
        } else {
          $scope.orderByField = field;
          if (field === 'last_change_time') {
            $scope.orderDir = desc;
          } else {
            $scope.orderDir = asc;
          }
        }

        if (field !== 'status') {
          $scope.orderByFields.push('status');
        }
        $scope.orderByFields.push($scope.orderDir + $scope.orderByField);
        if ($scope.orderByField !== 'assignedTo') {
          $scope.orderByFields.push('-assignedTo');
        }
      };

      function isResolved(bug) {
        return bug.status === 'CLOSED';
      }

      $scope.$watch('bugs', function() {
        var bugsResolved = Math.floor($scope.bugs.filter(isResolved).length);
        var totalBugs =  $scope.bugs.length;
        $scope.complete = {
          percentage:  Math.round(bugsResolved / totalBugs * 100),
          resolved: bugsResolved,
          total: totalBugs
        };
        if ($scope.complete.percentage === 100) {
          $scope.hideResolved = false;
        }
      });
    }
  ])
  .controller('ArchivedCtrl', [
    '$scope',
    'sprintService',
    function ($scope, sprintService) {
      $scope.pageTitle = 'Archieved'
      sprintService
        .getArchived()
        .success(function (sprints) {
          $scope.sprints = sprints;
        });
    }
  ]);
