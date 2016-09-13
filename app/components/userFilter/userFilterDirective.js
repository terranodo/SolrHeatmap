/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,90]*/
/**
 * Filter by user directive
 */
(function() {
    angular
    .module('search_userFilter_component', [])
    .directive('userFilter', userFilter);

    function userFilter() {
        return {
            controller: UserFilterController,
            restrict: 'EA',
            templateUrl: 'app/components/userFilter/userFilter.html'
        };
    }

    UserFilterController.$inject = ['HeatMapSourceGenerator', '$scope', '$uibModal'];
    function UserFilterController(HeatMapSourceGeneratorService, $scope, $uibModal) {

        $scope.userSearch = userSearch;

        $scope.showInfo = showInfo;

        /**
         *
         */
        function userSearch() {
            HeatMapSourceGeneratorService.filterObj.setUser($scope.userfilterInput);
            HeatMapSourceGeneratorService.performSearch();
        }

        function showInfo(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'infoPopup.html',
                controller: 'InfoWindowController',
                size: 'lg',
                resolve: {
                    infoMsg: function(){
                        return solrHeatmapApp.instructions.
                                                userfilter.instruction;
                    },
                    toolName: function(){
                        return solrHeatmapApp.instructions.
                                                userfilter.toolTitle;
                    }
                }
            });
        }
    }
})();
