/*eslint angular/di: [2,"array"]*/
(function() {
    angular.module('SolrHeatmapApp')
    .factory('DateTimeService', ['searchFilter', function(searchFilter){
        var service = {
            formatDatesToString: formatDatesToString,
            getTimeFormat: getTimeFormat,
            durationFormat: durationFormat
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

        function durationFormat() {
            var gap = searchFilter.gap;
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

        function getTimeFormat() {
            var gap = searchFilter.gap;
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

        return service;
    }]);
})();
