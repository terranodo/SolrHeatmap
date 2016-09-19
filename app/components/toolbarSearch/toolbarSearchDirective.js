/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,120]*/
/**
 * Search Directive
 */
(function() {
    angular
    .module('search_toolbarsearch_component', [])
    .directive('toolbarSearch', toolbarSearch);

    function toolbarSearch() {
        return {
            controller: toolbarSearchController,
            restrict: 'EA',
            templateUrl: 'app/components/toolbarSearch/toolbarSearchField.html'
        };
    }

    toolbarSearchController.$inject = ['Map', 'HeatMapSourceGenerator', '$scope',
                                        '$uibModal', '$controller', '$window', 'InfoService'];
    function toolbarSearchController(MapService, HeatMapSourceGeneratorService,
                                        $scope, $uibModal, $controller, $window, InfoService) {
        /**
         *
         */
        $scope.searchInput = '';

        /**
         *
         */
        function getKeyboardCodeFromEvent(keyEvt) {
            return $window.event ? keyEvt.keyCode : keyEvt.which;
        }

        /**
         *
         */
        $scope.onKeyPress = function($event) {
            // only fire the search if Enter-key (13) is pressed
            if (getKeyboardCodeFromEvent($event) === 13) {
                $scope.doSearch();
            }
        };

        /**
         *
         */
        $scope.doSearch = function() {
            // if no input is given
            // if ($scope.searchInput.length === 0) {
            //    return false;
            // }

            HeatMapSourceGeneratorService.filterObj.setSearchText($scope.searchInput);
            HeatMapSourceGeneratorService.performSearch();
        };

        $scope.resetSearchInput = function() {
            $scope.searchInput = '';
            HeatMapSourceGeneratorService.filterObj.setSearchText('');
            HeatMapSourceGeneratorService.performSearch();

            // Reset the map
            MapService.resetMap();

            // Reset the date fields
            var ctrlViewModelNew = $scope.$new();
            $controller('DatePickerController', {$scope : ctrlViewModelNew });
            ctrlViewModelNew.setInitialDates();
        };

        $scope.showtoolbarSearchInfo = function() {
            InfoService.showInfoPopup('textsearch');
        };
    }
})();
