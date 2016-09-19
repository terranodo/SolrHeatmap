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
            templateUrl: 'app/components/toolbarSearch/toolbarSearchField.html',
            controllerAs: 'vm'
        };
    }

    toolbarSearchController.$inject = ['Map', 'HeatMapSourceGenerator', '$uibModal',
                                        '$controller', '$window', 'InfoService'];
    function toolbarSearchController(MapService, HeatMapSourceGeneratorService,
                                        $uibModal, $controller, $window, InfoService) {

        var vm = this;
        /**
         *
         */
        vm.searchInput = '';

        /**
         *
         */
        function getKeyboardCodeFromEvent(keyEvt) {
            return $window.event ? keyEvt.keyCode : keyEvt.which;
        }

        /**
         *
         */
        vm.onKeyPress = function($event) {
            // only fire the search if Enter-key (13) is pressed
            if (getKeyboardCodeFromEvent($event) === 13) {
                vm.doSearch();
            }
        };

        /**
         *
         */
        vm.doSearch = function() {
            // if no input is given
            // if (vm.searchInput.length === 0) {
            //    return false;
            // }

            HeatMapSourceGeneratorService.filterObj.setSearchText(vm.searchInput);
            HeatMapSourceGeneratorService.performSearch();
        };

        vm.resetSearchInput = function() {
            vm.searchInput = '';
            HeatMapSourceGeneratorService.filterObj.setSearchText('');
            HeatMapSourceGeneratorService.performSearch();

            // Reset the map
            MapService.resetMap();

            // Reset the date fields
            //ToDo: Reset date fields
        };

        vm.showtoolbarSearchInfo = function() {
            InfoService.showInfoPopup('textsearch');
        };
    }
})();
