(function() {
    angular
    .module('search_layerList_component', [])
    .directive('layerList', layerList);

    function layerList() {
        return {
            link: layerListLink,
            restrict: 'EA',
            templateUrl: 'components/layerList/layerList.tpl.html',
            scope: {}
        };

        function layerListLink(scope) {
            var vm = scope;
            vm.layerList = [];
            vm.layerList.exist = false;
            vm.$on('setTweetList', setLayerList);

            function setLayerList(event, layerListData) {
                vm.layerList = layerListData;
                vm.layerList.exist = true;
            }
        }
    }

})();
