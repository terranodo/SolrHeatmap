/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,120]*/
/**
 * Search Directive
 */
(function() {
    angular
    .module('search_toolbarsearch_component', [])
    .directive('toolbarSearch', ['$rootScope', 'Map', 'HeatMapSourceGenerator',
        '$window', 'InfoService', 'searchFilter',
        function toolbarSearch($rootScope, Map, HeatMapSourceGenerator, $window, InfoService, searchFilter) {
            var MapService = Map;

            return {
                link: toolbarSearchLink,
                restrict: 'EA',
                templateUrl: 'components/toolbarSearch/toolbarSearchField.tpl.html',
                scope: {}
            };

            function toolbarSearchLink(scope) {
                var vm = scope;

                vm.filter = searchFilter;
                vm.filterArray = [];
                vm.textSearchInput = {
                    value: '',
                    previousLength: 0
                };
                vm.focus = false;

                vm.removeKeyWord = removeKeyWord;

                scope.$watch(function(){
                    return vm.filter.text;
                }, function(newValue, oldValue){
                    vm.filterArray = keyWordStringToArray(newValue);
                });

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
                    }else if (getKeyboardCodeFromEvent($event) === 8) {
                        removeKeyWordFromDeleteKey();
                    }
                };

                /**
                 *
                 */
                vm.doSearch = function() {
                    var fiterText;
                    if (vm.textSearchInput.value.length) {
                        fiterText = vm.filter.text || '';
                        vm.filter.text = fiterText + ' "' + vm.textSearchInput.value + '"';
                        vm.textSearchInput = {value: '', previousLength: 0};
                    }
                    HeatMapSourceGenerator.search(vm.filter.text);
                };

                vm.reset = function() {
                    searchFilter.resetFilter();
                    HeatMapSourceGenerator.search();
                    // Reset the map
                    MapService.resetMap();
                };

                vm.showtoolbarSearchInfo = function() {
                    InfoService.showInfoPopup('textsearch');
                };

                function keyWordStringToArray(keyWordString) {
                    var keyWordList = [];
                    if (keyWordString) {
                        keyWordString.split('"').forEach(function(val){
                            if(val !== '' && val !== ' '){
                                keyWordList.push(val);
                            }
                        });
                    }
                    return keyWordList;
                }

                function removeKeyWord(keyword) {
                    var fiterText = '';
                    vm.filterArray.forEach(function(value) {
                        if (value !== keyword) {
                            fiterText = fiterText + ' "' + value + '"';
                            return;
                        }
                    });
                    vm.filter.text = fiterText;
                    HeatMapSourceGenerator.search(vm.filter.text);
                }

                function removeKeyWordFromDeleteKey() {
                    if (vm.textSearchInput.value === '' && vm.textSearchInput.previousLength === 0) {
                        removeKeyWord(vm.filterArray.pop());
                    }
                    vm.textSearchInput.previousLength = vm.textSearchInput.value.length;
                }
            }
        }]);
})();
