/*eslint angular/di: [2,"array"]*/
/*eslint angular/document-service: 2*/
/*eslint max-len: [2,150]*/
/**
 * HeatMapSourceGenerator Service
 */
(function() {
    angular
    .module('SolrHeatmapApp')
    .factory('HeatMapSourceGenerator', ['Map', '$rootScope', '$controller', '$filter', '$window', '$document', '$http', '$state', 'searchFilter',
        function(Map, $rootScope, $controller, $filter, $window, $document , $http, $state, searchFilter) {
            var MapService= Map;

            var methods = {
                search: search,
                startCsvExport: startCsvExport,
                getFormattedDateString: getFormattedDateString
            };
            /**
             *
             */
            function getTweetsSearchQueryParameters (bounds) {
                var params,
                    reqParamsUi = searchFilter;

                /*
                // calculate reduced bounding box
                */
                params = {
                    'q.text': reqParamsUi.text,
                    'q.user': reqParamsUi.user,
                    'q.time': '[1900-01-01 TO 2016-12-31T00:00:00]', //timeTextFormat(reqParamsUi.time, reqParamsUi.minDate, reqParamsUi.maxDate),
                    'q.geo': reqParamsUi.geo,
                    'a.hm.filter': '[-1,1 TO 2,4]', //reqParamsUi.hm,
                    'a.time.limit': '1',
                    'a.time.gap': 'PT1H',
                    'd.docs.limit': '10',
                    'a.text.limit': '5'
                };
                $state.go('search', {
                    text: params['q.text'],
                    user: params['q.user'],
                    time: params['q.time'],
                    geo: params['q.geo']
                }, {notify: false, location: "replace"}
                );
                return params;
            }
            var createParamsForGeospatialSearch = function() {
                //var spatialFilters = MapService.getCurrentExtent(), params;
                return getTweetsSearchQueryParameters();
            };

            return methods;



            /**
             * Performs search with the given full configuration / search object.
             */
            function search(){
                var config,
                    params = createParamsForGeospatialSearch();
                if (params) {
                    // params['a.hm.limit'] = solrHeatmapApp.bopwsConfig.heatmapFacetLimit;

                    config = {
                        url: solrHeatmapApp.appConfig.hypermap,
                        method: 'GET',
                        params: params
                    };
                    //load the data
                    $http(config)
                    .then(function successCallback(response) {
                        // check if we have a heatmap facet and update the map with it
                        var data = response.data;
                        if (data) {
                            // get the count of matches
                            $rootScope.$broadcast('setCounter', data['a.matchDocs']);

                            if (data['a.hm']) {
                                MapService.createOrUpdateHeatMapLayer(data['a.hm']);
                            }
                            if (data['a.time']) {
                                $rootScope.$broadcast('setHistogram', data['a.time']);
                                searchFilter.histogramCount = data['a.time'].counts;
                            }
                            if (data['d.docs']) {
                                $rootScope.$broadcast('setTweetList', data['d.docs']);
                            }
                            if (data['a.text']) {
                                $rootScope.$broadcast('setSuggestWords', data['a.text']);
                            }
                        }
                    }, function errorCallback(response) {
                        $window.alert('An error occured while reading heatmap data');
                    })
                    .catch(function() {
                        $window.alert('An error occured while reading heatmap data');
                    });
                } else {
                    $window.alert('Spatial filter could not be computed.');
                }
            }


            /**
             * Help method to build the whole params object, that will be used in
             * the API requests.
             */
            function startCsvExport(numberOfDocuments){
                var config,
                    params = createParamsForGeospatialSearch();
                if (params) {
                    params['d.docs.limit'] = angular.isNumber(numberOfDocuments) ?
                            numberOfDocuments : solrHeatmapApp.bopwsConfig.csvDocsLimit;
                    config = {
                        url: solrHeatmapApp.appConfig.tweetsExportBaseUrl,
                        method: 'GET',
                        params: params
                    };

                    //start the export
                    $http(config)
                    .then(function successCallback(response) {
                        var anchor = angular.element('<a/>');
                        anchor.css({display: 'none'}); // Make sure it's not visible
                        angular.element($document.body).append(anchor); // Attach to document
                        anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                            target: '_blank',
                            download: 'bop_export.csv'
                        })[0].click();
                        anchor.remove(); // Clean it up afterwards
                    }, function errorCallback(response) {
                        $window.alert('An error occured while exporting csv data');
                    })
                    .catch(function() {
                        $window.alert('An error occured while exporting csv data');
                    });
                } else {
                    $window.alert('Spatial filter could not be computed.');
                }
            }

            /**
             * Returns the formatted date object that can be parsed by API.
             * @param {minDate} date full date object
                            (e.g. 'Sat Jan 01 2000 01:00:00 GMT+0100 (CET))
             * @return {String} formatted date as string (e.g. [2013-03-10T00:00:00 TO 2013-03-21T00:00:00])
             */
            function getFormattedDateString(minDate, maxDate){
                return '[' + minDate.toISOString().replace('.000Z','') + ' TO ' +
                  maxDate.toISOString().replace('.000Z','') + ']';
            }
            function timeTextFormat(textDate, minDate, maxDate) {
                return textDate === null ? getFormattedDateString(minDate, maxDate) : textDate;
            }


        }]
);
})();
