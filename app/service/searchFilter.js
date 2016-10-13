/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,100]*/

(function() {
    angular.module('SolrHeatmapApp')
    .factory('searchFilter', ['Map', function(Map){
        var MapService = Map;
        var service = {
            minDate: new Date('2016-10-10'),
            maxDate: new Date('2016-10-21'),
            time: null,
            text: null,
            user: null,
            geo: '[-90,-180 TO 90,180]',
            hm: '[-1,1 TO 2,4]',
            histogramCount: [],
            textLimit: null,
            docs: heightModule().numberofItems()
        };

        var emptyStringForNull = function(value) {
            return value === null ? '' : value;
        };
        service.setFilter = function(filter) {
            if(filter.time) {
                service.time = filter.time;
            }
            if(filter.user) {
                service.user = filter.user;
            }
            if(filter.text) {
                service.text = filter.text;
            }
            if(filter.geo) {
                service.geo = filter.geo;
                service.hm = MapService.getReducedQueryFromExtent(filter.geo);
            }
        };
        service.resetFilter = function() {
            service.time = null;
            service.text = null;
            service.user = null;
            service.geo = '[-90,-180 TO 90,180]';
            service.textLimit = null;
        };

        service.heightModule = heightModule;

        function heightModule(itemHeight, otherHeights) {

            itemHeight = itemHeight || 90;
            //time search field, padding, table header, pagination
            otherHeights = otherHeights || 360;

            function documentHeight() {
                var D = document;
                return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight,
                    D.body.offsetHeight, D.documentElement.offsetHeight,
                    D.body.clientHeight, D.documentElement.clientHeight);
            }

            function availableHeight() {
                return documentHeight() - otherHeights;
            }

            function calculateNumberofItems() {
                return Math.round(availableHeight() / itemHeight);
            }

            return {
                documentHeight: documentHeight,
                availableHeight: availableHeight,
                numberofItems: calculateNumberofItems
            };
        }

        return service;
    }]);
})();
/*
function setHistogramCount(val) {
searchObj.histogramCount = angular.isArray(val) && val.length !== 0 ? val : [];
}
*/
