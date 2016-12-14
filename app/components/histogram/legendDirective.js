(function() {
    angular
    .module('search_legendhistogram_component', [])
    .directive('legendHistogram', [function() {
        return {
            templateUrl: 'components/histogram/legend.tpl.html',
            restrict: 'EA',
            link: legendHistogramLink,
            scope: {
                dimensions: '='
            }
        };

        function legendHistogramLink(scope) {

            var vm = scope;

            vm.$watch(function(){
                return vm.dimensions;
            }, function(){
                if (Object.keys(vm.dimensions).length !== 0) {
                    timeBar(vm.dimensions);
                }
            });

            function timeBar(dimensions) {
                vm.legendList = [];
                var partition = 10;
                var delta = dimensions.counts.length/partition;

                for (var i = 0; i < partition; i++) {
                    var index = Math.round(i*delta);
                    var hour = new Date(dimensions.counts[index].value).getUTCHours();
                    vm.legendList.push(hour);
                }
                vm.legendWidth = dimensions.histogrambarsWidth/vm.legendList.length;
            }
        }
    }]);
})()
