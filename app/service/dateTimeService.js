/*eslint angular/di: [2,"array"]*/
(function() {
    angular.module('SolrHeatmapApp')
    .factory('DateTimeService', [function(){
        var service = {
            formatDatesToString: formatDatesToString,
            getGapFromTimeString: getGapFromTimeString
        };

        /**
         * Returns the formatted date object that can be parsed by API.
         * @param {minDate} date full date object
                        (e.g. 'Sat Jan 01 2000 01:00:00 GMT+0100 (CET))
         * @return {String} formatted date as string
            (e.g. [2013-03-10T00:00:00 TO 2013-03-21T00:00:00])
         */
        function formatDatesToString(minDate, maxDate) {
            return '[' + minDate.toISOString().replace('.000Z','') + ' TO ' +
              maxDate.toISOString().replace('.000Z','') + ']';
        }

        function formatStringToDates(stringDates){
            var dates = stringDates.split(' TO ');
            dates[0] = dates[0].slice(1);
            dates[1] = dates[1].slice(0, -1);
            return dates;
        }

        function getGapFromTimeString(timeString) {
            if (!timeString) {
                return;
            }
            var gap;
            var partition = 120;
            var dates = formatStringToDates(timeString);
            var diffms = moment(dates[1]).diff(dates[0]),
                days = diffms/(1000*3600*24),
                years = days/365,
                months = years * 12;

            if (days <= partition) {
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

        return service;
    }]);
})();
