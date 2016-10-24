/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,100]*/

(function() {
    angular.module('SolrHeatmapApp')
    .factory('searchFilter', ['Map', 'HeightModule', function(Map, HeightModule){
        var MapService = Map;
        var service = {
            geo: '[-90,-180 TO 90,180]',
            hm: '[-1,1 TO 2,4]',
            time: null,
            text: null,
            user: null,
            histogramCount: [],
            textLimit: null,
            getNumOfDocs: HeightModule.getNumberofItems,
            minDate: new Date('2013-03-10'),
            maxDate: new Date('2013-03-21')
        };

        var emptyStringForNull = function(value) {
            return value === null ? '' : value;
        };
        service.setFilter = function(filter, text) {
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
                service.geo = MapService.getReducedQueryFromExtent(filter.geo);
                service.hm = filter.geo;
            }
            console.log(text, service);
        };

        service.resetFilter = function() {
            service.time = null;
            service.text = null;
            service.user = null;
            service.geo = '[-90,-180 TO 90,180]';
            service.textLimit = null;
        };

        return service;
    }]);
})();
/*
function setHistogramCount(val) {
searchObj.histogramCount = angular.isArray(val) && val.length !== 0 ? val : [];
}
*/
