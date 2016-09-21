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
            templateUrl: 'geospatialFilter/geospatialFilter.tpl.html'
        };
    }

    GeospatialFilterController.$inject = ['$scope', '$uibModal', 'InfoService'];
    function GeospatialFilterController($scope, $uibModal, InfoService) {

        $scope.filterString = '[-90,-180 TO 90,180]';

        $scope.showGeospatialInfo = function() {
            InfoService.showInfoPopup('geospatialsearch');
        };

        $scope.updateFilterString = function(str) {
            $scope.filterString = str;
        };

    }
})();
