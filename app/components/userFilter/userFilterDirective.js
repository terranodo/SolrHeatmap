/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,90]*/
/**
 * Filter by user directive
 */
(function() {
    angular
    .module('search_userFilter_component', [])
    .directive('userFilter', ['HeatMapSourceGenerator', 'InfoService', '$uibModal',
        function(HeatMapSourceGenerator, InfoService, $uibModal) {
            return {
                link: UserFilterLink,
                restrict: 'EA',
                templateUrl: 'components/userFilter/userFilter.tpl.html',
                scope: {}
            };

            function UserFilterLink(scope) {

                scope.userfilterInput = '';

                scope.userSearch = userSearch;

                scope.resetUser = resetUser;

                scope.showUserFilterInfo = showUserFilterInfo;
                /**
                 *
                 */
                function userSearch() {
                    HeatMapSourceGenerator.filterObj.setUser(scope.userfilterInput);
                    HeatMapSourceGenerator.performSearch();
                }

                function resetUser() {
                    scope.userfilterInput = '';
                    userSearch();
                }

                function showUserFilterInfo() {
                    InfoService.showInfoPopup('userfilter');
                }
            }
        }]);
})();
