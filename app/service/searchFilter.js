/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,100]*/

(function() {
    angular.module('SolrHeatmapApp')
    .factory('searchFilter', ['Map', 'HeightModule', function(Map, HeightModule){
        var MapService = Map;
        var service = {
            geo: '[-90,-180 TO 90,180]',
            hm: '[-90,-180 TO 90,180]',
            time: null,
            text: null,
            user: null,
            textLimit: null,
            userLimit: null,
            numOfDocs: 50,
            gap: 'P1M',
            minDate: new Date(moment('2014-08-25').format('YYYY-MM-DD')),
            maxDate: new Date(moment().format('YYYY-MM-DD'))
        };

        var emptyStringForNull = function(value) {
            return value === null ? '' : value;
        };
        service.setFilter = function(filter) {
            if(filter.time) {
                service.time = filter.time;
                service.gap = getGapFromTimeString(filter.time);
            }
            if(filter.user) {
                service.user = filter.user;
            }
            if(filter.text) {
                service.text = filter.text;
            }
            if(filter.geo) {
                service.geo = filter.geo;
            }
            if (filter.hm) {
                service.hm = filter.hm;
            }
        };

        service.resetFilter = function() {
            service.time = null;
            service.text = null;
            service.user = null;
            service.geo = MapService.getCurrentExtentQuery().geo;
            service.textLimit = null;
        };

        function getGapFromTimeString(timeString) {
            if (!timeString) {
                return;
            }
            var gap,
                partition = 120,
                dates = formatStringToDates(timeString),
                diffms = moment(dates[1]).diff(dates[0]),
                hours = diffms/(1000*3600),
                days = hours/24,
                years = days/365,
                months = years * 12;

            if (hours <= partition) {
                gap = 'PT1H';
            }else if (days <= partition) {
                gap = 'P1D';
            }else if (days/7 <= partition) {
                gap = 'P1W';
            }else if (months <= partition) {
                gap = 'P1M';
            }else {
                gap = 'P1Y';
            }
            return gap;
        }

        function formatStringToDates(stringDates){
            var dates = stringDates.split(' TO ');
            dates[0] = dates[0].slice(1);
            dates[1] = dates[1].slice(0, -1);
            return dates;
        }

        return service;
    }]);
})();
