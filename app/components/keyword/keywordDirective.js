(function() {
angular
    .module('search_keyword_component', [])
    .directive('keyword', [
        function keyword() {
            return {
                scope: {
                    remove: '=',
                    tag: '@'
                },
                link: keywordLink,
                templateUrl: 'components/keyword/keyword.tpl.html',
            }

            function keywordLink(scope) {
                var vm = scope;
            }
        }]);
})();
