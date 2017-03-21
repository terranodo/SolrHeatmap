/*eslint angular/di: [2,"array"]*/
(function() {
    angular
    .module('search_legendhistogram_component', [])
    .directive('legendHistogram', ['searchFilter', function(searchFilter) {
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
                var partition = 5;
                var delta = dimensions.counts.length/partition;
                for (var i = 0; i < partition; i++) {
                    var index = Math.round(i*delta);
                    var date = moment(dimensions.counts[index].value).utc();
                    vm.legendList.push(date.format(durationFormat()));
                }
                vm.legendWidth = (dimensions.histogrambarsWidth - dimensions.paddingBar*2)/vm.legendList.length;
                vm.paddingBar = dimensions.paddingBar;
            }

            function durationFormat() {
                var gap = searchFilter.gap;
                if (gap === 'P1D') {
                    return 'MMM-DD';
                } else if (gap === 'P1M') {
                    return 'YYYY-MMM';
                } else if (gap === 'P1Y') {
                    return 'YYYY';
                }
            }
        }
    }]);
})();
