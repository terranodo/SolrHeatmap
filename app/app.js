/**
 * The main solrHeatmapApp module
 */
(function() {
    angular.module('SolrHeatmapApp', [
        'templates-components',
        'ui.bootstrap',
        'rzModule',
        'search_components',
        'ui.router'
    ]);
    angular.module('SolrHeatmapApp')
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlRouterProvider.otherwise('/search');
        $stateProvider.state({
            name: 'search',
            url: '/search?time&geo&text&user',
            component: 'search',
            resolve: {
                search: function($stateParams,HeatMapSourceGenerator,searchFilter) {
                    var text = 'app.js --> config--> $stateParams --> setFilter --> service: ';
                    searchFilter.setFilter($stateParams, text);
                }
            }
        });
    });
})();
