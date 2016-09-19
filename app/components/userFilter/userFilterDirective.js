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

    UserFilterController.$inject = ['HeatMapSourceGenerator', '$scope',
                                    '$uibModal', 'InfoService'];
    function UserFilterController(HeatMapSourceGeneratorService, $scope,
                                    $uibModal, InfoService) {

        $scope.userSearch = userSearch;

        $scope.showUserFilterInfo = showUserFilterInfo;

        /**
         *
         */
        function userSearch() {
            HeatMapSourceGeneratorService.search($scope.userfilterInput);
        }

        function showUserFilterInfo() {
            InfoService.showInfoPopup('userfilter');
        }
    }
})();
