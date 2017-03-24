/*eslint angular/di: [2,"array"]*/
(function() {
    angular.module('SolrHeatmapApp')
    .factory('DateTimeService', [function(){
        var service = {
            formatDatesToString: formatDatesToString,
            getTimeFormat: getTimeFormat,
            durationFormat: durationFormat,
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

        function durationFormat(gap) {
            if (gap === 'PT1H') {
                return 'MMM.D.H[h]';
            }else if(gap === 'P1D') {
                return 'MMM-DD';
            } else if(gap === 'P1W' || gap === 'P7D'){
                return 'YYYY-MMM';
            } else if (gap === 'P1M') {
                return 'YYYY-MMM';
            } else if (gap === 'P1Y') {
                return 'YYYY';
            }
        }

        function getTimeFormat(gap) {
            if (gap === 'PT1H') {
                return 'hours';
            } else if(gap === 'P1D') {
                return 'days';
            } else if(gap === 'P1W' || gap === 'P7D'){
                return 'weeks';
            } else if (gap === 'P1M') {
                return 'months';
            } else if (gap === 'P1Y') {
                return 'years';
            }
        }

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
