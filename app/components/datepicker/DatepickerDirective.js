/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,100]*/
/**
 * DatePickerCtrl Controller
 */
(function() {

    angular
    .module('search_datepicker_component', [])
    .directive('datePicker', datePicker);

    function datePicker() {
        return {
            controller: datePickerFilterController,
            controllerAs: 'vm',
            templateUrl: 'components/datepicker/datepicker.tpl.html',
            restrict: 'EA'
        };
    }

    datePickerFilterController.$inject = [
        '$rootScope', 'HeatMapSourceGenerator','$uibModal', '$scope', 'InfoService'
    ];
    function datePickerFilterController(
        $rootScope, HeatMapSourceGeneratorService, $uibModal, $scope, InfoService) {

        var vm = this;

        vm.initialDateOptions = {
            minDate: new Date('2013-03-01'),
            maxDate: new Date('2013-04-01')
        };

        vm.dateOptions = {
            minDate: HeatMapSourceGeneratorService.filterObj.getSearchObj().minDate,
            maxDate: HeatMapSourceGeneratorService.filterObj.getSearchObj().maxDate,
            startingDay: 1,
            showWeeks: false
        };

        vm.dateString = getFormattedDateString(vm.dateOptions.minDate, vm.dateOptions.maxDate);

        vm.startDate = {
            opened: false
        };

        vm.endDate = {
            opened: false
        };

        vm.onChangeDatepicker = onChangeDatepicker;

        vm.showDatepickerInfo = showDatepickerInfo;

        vm.openEndDate = openEndDate;

        vm.openStartDate = openStartDate;

        vm.onSubmitDateText = onSubmitDateText;

        vm.slider = defaultSliderValue();

        /**
         * Set initial values for min and max dates in both of datepicker.
         */
        vm.setInitialDates = function(){
            vm.dts = vm.dateOptions.minDate;
            vm.dte = vm.dateOptions.maxDate;
        };

        vm.setInitialDates();

        $scope.$on('setHistogram', setHistogram);

        $scope.$on('slideEnded', slideEnded);

        /**
         * Will be called on click on start datepicker.
         * `minDate` will be reset to the initial value (e.g. 2000-01-01),
         * `maxDate` will be adjusted with the `$scope.dte` value to
         *  restrict it not to be below the `minDate`.
         */
        function openStartDate() {
            vm.startDate.opened = true;
            vm.dateOptions.minDate = vm.initialDateOptions.minDate;
            vm.dateOptions.maxDate = vm.dte;
        }


        /**
         * Will be called on click on end datepicker.
         * `maxDate` will be reset to the initial value (e.g. 2016-12-31),
         * `minDate` will be adjusted with the `$scope.dts` value to
         *  restrict it not to be bigger than the `maxDate`.
         */
        function openEndDate() {
            vm.endDate.opened = true;
            vm.dateOptions.maxDate = vm.initialDateOptions.maxDate;
            vm.dateOptions.minDate = vm.dts;
        }

        /**
         * Will be fired after the start and the end date was chosen.
         */
        function onChangeDatepicker(){
            vm.dateString = getFormattedDateString(vm.dts, vm.dte);
            performDateSearch();
        }

        function getFormattedDateString(minDate, maxDate) {
            return '[' + minDate.toISOString().replace('.000Z','') + ' TO ' +
              maxDate.toISOString().replace('.000Z','') + ']';
        }

        function stringToDate(dateString) {
            var dateArray = dateString.split(' TO ');
            if (angular.isString(dateString) && dateArray.length === 2) {
                dateArray[0] = new Date(dateArray[0].slice(1,11));
                dateArray[1] = new Date(dateArray[1].slice(0,10));
                if (dateArray[0] === 'Invalid Date' || dateArray[0] === 'Invalid Date') {
                    return null;
                }
                return dateArray;
            }
            return null;
        }

        function onSubmitDateText() {
            var dateArray = stringToDate(vm.dateString);
            if (dateArray !== null) {
                vm.dts = dateArray[0];
                vm.dte = dateArray[1];
                performDateSearch();
            } else{
                vm.dateString = getFormattedDateString(vm.dts, vm.dte);
            }
        }

        function showDatepickerInfo() {
            InfoService.showInfoPopup('datepicker');
        }

        function setHistogram(event, dataHistogram) {
            if (vm.slider.options.ceil === 1 || vm.slider.changeTime === false) {
                vm.slider.counts = dataHistogram.counts;
                vm.slider.options.ceil = vm.slider.maxValue = dataHistogram.counts.length - 1;
                dataHistogram.slider = vm.slider;
                $rootScope.$broadcast('setHistogramRangeSlider', dataHistogram);
            }else{
                vm.slider.changeTime = false;
                $rootScope.$broadcast('changeSlider', vm.slider);
            }
        }

        function slideEnded() {
            var minKey = vm.slider.minValue;
            var maxKey = vm.slider.maxValue;
            vm.dts = new Date(vm.slider.counts[minKey].value);
            vm.dte = new Date(vm.slider.counts[maxKey].value);
            vm.dateString = getFormattedDateString(vm.dts, vm.dte);
            performDateSearch();
        }

        function performDateSearch() {
            HeatMapSourceGeneratorService.filterObj.setTextDate(vm.dateString);
            vm.slider.changeTime = true;
            HeatMapSourceGeneratorService.performSearch();
        }

        function defaultSliderValue() {
            return {
                minValue: 0,
                maxValue: 1,
                changeTime: false,
                options: {
                    floor: 0,
                    ceil: 1,
                    step: 1,
                    noSwitching: true, hideLimitLabels: true,
                    getSelectionBarColor: function() {
                        return '#3da9ca';
                    },
                    translate: function() {
                        return '';
                    }
                }
            };
        }
    }

})();
