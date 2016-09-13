/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/**
 * Geospatial filter Directive
 */
(function() {
    angular
    .module('search_geospatialFilter_component', [])
    .directive('geospatialFilter', geospatialFilter);

    function geospatialFilter() {
        return {
            controller: GeospatialFilterController,
            restrict: 'EA',
            templateUrl: 'app/components/geospatialFilter/geospatialFilter.html'
        };
    }

    GeospatialFilterController.$inject = ['$scope', '$uibModal', 'InfoService'];
    function GeospatialFilterController($scope, $uibModal, InfoService) {

        $scope.filterString = '[-90,-180 TO 90,180]';

        $scope.showGeospatialInfo = function() {
            InfoService.showInfoPopup(solrHeatmapApp.instructions.geospatialsearch.instruction,
                solrHeatmapApp.instructions.geospatialsearch.toolTitle);
        };

        $scope.updateFilterString = function(str) {
            $scope.filterString = str;
        };

    }
})();
