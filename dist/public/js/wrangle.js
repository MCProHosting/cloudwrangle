var app;

app = angular.module('CloudWrangle', ['ngAnimate']);

app.controller('WrangleController', [
  '$scope', '$http', function($scope, $http) {
    var queryAll, queryAllLast;
    $scope.data = null;
    $scope.message = [];
    $scope.domain = {
      chosen: false,
      name: '',
      active: false,
      choose: function() {
        this.chosen = true;
        this.active = true;
        return queryAll('api/' + this.name + '/record');
      }
    };
    $scope.search = {
      active: false,
      query: '',
      search: function() {
        this.active = true;
        return queryAll(queryAllLast[0], {
          q: this.query
        })["finally"](function() {
          return $scope.search.active = false;
        });
      }
    };
    $scope.record = {
      loading: false,
      types: ['A', 'CNAME', 'MX', 'TXT', 'SPF', 'AAAA', 'NS', 'SRV', 'LOC'],
      protocols: ['_tcp', '_udp', '_tis'],
      shows: {
        service_mode: function(record) {
          return ['A', 'AAAA', 'CNAME'].indexOf(record.data.type) !== -1;
        },
        prio: function(record) {
          return ['MX', 'SRV'].indexOf(record.data.type) !== -1;
        },
        service: function(record) {
          return record.data.type === 'SRV';
        },
        srvname: function(record) {
          return record.data.type === 'SRV';
        },
        protocol: function(record) {
          return record.data.type === 'SRV';
        },
        weight: function(record) {
          return record.data.type === 'SRV';
        },
        port: function(record) {
          return record.data.type === 'SRV';
        },
        target: function(record) {
          return record.data.type === 'SRV';
        }
      },
      edit: function(record) {
        if (record.editing) {
          record.editing = false;
          return;
        }
        if (record.data == null) {
          this.loading = true;
          return $http({
            method: 'GET',
            url: 'api/' + $scope.domain.name + '/record/' + record.id
          }).success((function(_this) {
            return function(data) {
              angular.extend(record, data);
              record.editing = true;
              return _this.loading = false;
            };
          })(this));
        } else {
          return record.editing = true;
        }
      },
      save: function(record) {
        var data, key, test, _ref;
        this.loading = true;
        data = angular.copy(record.data);
        _ref = this.shows;
        for (key in _ref) {
          test = _ref[key];
          if (!test(record)) {
            delete data[key];
          }
        }
        return $http({
          method: 'POST',
          url: 'api/' + $scope.domain.name + '/record/' + record.id,
          data: data
        })["finally"]((function(_this) {
          return function() {
            _this.loading = false;
            return record.editing = false;
          };
        })(this));
      },
      del: function(record) {
        this.loading = true;
        return $http({
          method: 'DELETE',
          url: 'api/' + $scope.domain.name + '/record/' + record.id
        })["finally"]($scope.refreshPage);
      }
    };
    queryAllLast = [];
    queryAll = function(query, data) {
      if (data == null) {
        data = {};
      }
      if (data.page == null) {
        data.page = 0;
      }
      queryAllLast = arguments;
      $scope.record.loading = true;
      return $http({
        method: 'GET',
        url: query,
        params: data
      }).success(function(results) {
        $scope.data = results;
        if (results.domain.status === 'loading') {
          return setTimeout($scope.refreshPage, 1000);
        } else {
          return $scope.record.loading = false;
        }
      }).error(function() {
        return $scope.message = ['danger', 'There was an error! Check your command line - its likely your CloudFlare keys are invalid.'];
      });
    };
    $scope.refreshPage = function() {
      return queryAll.apply(null, queryAllLast);
    };
    $scope.nextPage = function() {
      if (!$scope.data.hasNext) {
        return false;
      }
      queryAllLast[1].page++;
      return queryAll.apply(null, queryAllLast);
    };
    return $scope.prevPage = function() {
      if (!$scope.data.hasPrev) {
        return false;
      }
      queryAllLast[1].page--;
      return queryAll.apply(null, queryAllLast);
    };
  }
]);
