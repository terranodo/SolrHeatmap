(function() {
angular
    .module('search_keyword_component', [])
    .directive('keyword', [
        function keyword() {
            return {
                // link: keywordLink,
                templateUrl: 'components/keyword/keyword.tpl.html',
                scope: {}
            }
        }]);
})();
