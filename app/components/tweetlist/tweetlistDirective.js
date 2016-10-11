/*eslint angular/di: [2,"array"]*/
(function() {
    angular
    .module('search_tweetlist_component', [])
    .directive('tweetlist', ['Map',
        function tweetlist(Map) {
            var MapService = Map;
            return {
                link: tweetlistLink,
                restrict: 'EA',
                templateUrl: 'components/tweetlist/tweetlist.tpl.html',
                scope: {}
            };

            function tweetlistLink(scope) {
                var vm = scope;
                vm.tweetList = [];
                vm.tweetList.exist = false;

                vm.addCircle = addCircle;


                vm.$on('setTweetList', setTweetList);

                function setTweetList(event, tweetList) {
                    vm.tweetList = tweetList;
                    vm.tweetList.exist = true;
                }

                function addCircle(coordinates) {
                    var coordArray;
                    if (typeof coordinates !== 'string') {
                        return;
                    }
                    if (coordinates.includes(',')) {
                        coordArray = coordinates.split(',').map(function(val) {
                            return Number(val);
                        });
                        MapService.addCircle([coordArray[1], coordArray[0]]);
                    }
                }
            }
        }]);

})();
