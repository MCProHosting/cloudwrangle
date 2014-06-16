app = angular.module 'CloudWrangle', ['ngAnimate']

app.controller 'WrangleController', [
    '$scope'
    '$http'
    ($scope, $http) ->
        $scope.data = null
        $scope.message = []
        $scope.domain =
            chosen: false
            name: ''
            active: false
            choose: ->
                @chosen = true
                @active = true
                queryAll 'api/' + @name + '/record'

        $scope.search =
            active: false
            query: ''
            search: ->
                @active = true
                queryAll(
                  queryAllLast[0],
                    {
                        q: @query
                    }
                ).finally( ->
                    $scope.search.active = false
                )

        $scope.record =
            loading: false
            types: ['A', 'CNAME', 'MX', 'TXT', 'SPF', 'AAAA', 'NS', 'SRV', 'LOC']
            protocols: ['_tcp', '_udp', '_tis']
            shows:
                service_mode: (record) -> return ['A', 'AAAA', 'CNAME'].indexOf(record.data.type) isnt -1
                prio:         (record) -> return ['MX', 'SRV'].indexOf(record.data.type)          isnt -1
                service:      (record) -> return record.data.type is 'SRV'
                srvname:      (record) -> return record.data.type is 'SRV'
                protocol:     (record) -> return record.data.type is 'SRV'
                weight:       (record) -> return record.data.type is 'SRV'
                port:         (record) -> return record.data.type is 'SRV'
                target:       (record) -> return record.data.type is 'SRV'
            edit: (record) ->
                if record.editing
                    record.editing = false
                    return

                if not record.data?
                    @loading = true

                    $http(
                        method: 'GET'
                        url: 'api/' + $scope.domain.name + '/record/' + record.id
                    ).success (data) =>
                        angular.extend record, data
                        record.editing = true
                        @loading = false
                else
                    record.editing = true

            save: (record) ->
                @loading = true

                data = angular.copy record.data

                for key, test of @shows
                    if not test(record)
                        delete data[key]

                $http(
                    method: 'POST'
                    url: 'api/' + $scope.domain.name + '/record/' + record.id
                    data: data
                ).finally =>
                    @loading = false
                    record.editing = false

            del: (record) ->
                @loading = true

                $http(
                    method: 'DELETE'
                    url: 'api/' + $scope.domain.name + '/record/' + record.id
                ).finally $scope.refreshPage

        queryAllLast = []
        queryAll = (query, data = {}) ->
            if not data.page?
                data.page = 0

            queryAllLast = arguments
            $scope.record.loading = true

            return $http(
                method: 'GET'
                url: query
                params: data
            ).success( (results) ->
                $scope.data = results
                $scope.record.loading = false

                if results.domain.status is 'loading'
                    setTimeout $scope.refreshPage, 1000
            ).error( ->
                $scope.message = ['danger', 'There was an error! Check your command line - its likely your CloudFlare keys are invalid.']
            )

        $scope.refreshPage = ->
            return queryAll queryAllLast...

        $scope.nextPage = ->
            if not $scope.data.hasNext then return false

            queryAllLast[1].page++;

            return queryAll queryAllLast...

        $scope.prevPage = ->
            if not $scope.data.hasPrev then return false

            queryAllLast[1].page--;

            return queryAll queryAllLast...
]