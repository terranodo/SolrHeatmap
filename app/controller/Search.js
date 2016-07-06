/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,110]*/
/**
 * Search Controller
 */
angular.module('SolrHeatmapApp')
    .controller('SearchController', ['Map', 'HeatMapSourceGenerator', '$scope', '$controller', '$window',
        function(MapService, HeatMapSourceGeneratorService, $scope, $controller, $window) {

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

                HeatMapSourceGeneratorService.setSearchText($scope.searchInput);
                HeatMapSourceGeneratorService.performSearch();
            };

            $scope.resetSearchInput = function() {
                $scope.searchInput = '';
                HeatMapSourceGeneratorService.setSearchText('');
                HeatMapSourceGeneratorService.performSearch();

                // Reset the map
                MapService.resetMap();

                // Reset the date fields
                var ctrlViewModelNew = $scope.$new();
                $controller('DatePickerCtrl', {$scope : ctrlViewModelNew });
                ctrlViewModelNew.setInitialDates();
            };

        }]

);
