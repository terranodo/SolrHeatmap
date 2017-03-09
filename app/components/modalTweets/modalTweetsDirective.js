/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,90]*/
(function() {
    angular
    .module('search_modaltweets_component', [])
    .directive('modalTweets', ['Map',
        function(Map) {
            return {
                link: modalLink,
                restrict: 'EA',
                scope: {}
            };

            function modalLink(scope) {
                var vm = scope;
                var MapService = Map;

                vm.$on('mapReady', function () {
                    MapService.getMap().on('click', function(evt){
                        console.log('evt', evt);
                        var extentGeo = MapService.getCurrentExtentQuery().geo;
                        console.log(extentGeo);
                    })
                });
            }
        }]);
})();
