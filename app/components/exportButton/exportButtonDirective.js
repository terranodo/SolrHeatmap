/*eslint angular/controller-as: 0*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,90]*/
/**
 * Export Directive
 */
(function() {
    angular
    .module('search_exportButton_component', [])
    .directive('exportButton', exportButton);

    function exportButton() {
        return {
            controller: ExportController,
            restrict: 'EA',
            templateUrl: 'app/components/exportButton/exportButton.html'
        };
    }

    ExportController.$inject = ['HeatMapSourceGenerator', '$uibModal',
                                '$scope', 'InfoService'];
    function ExportController(HeatMapSourceGeneratorService, $uibModal,
                                $scope, InfoService) {

        $scope.export = {
            numDocuments: 1,
            options: {
                floor: 1,
                ceil: 10000,
                step: 1
            }
        };

        $scope.startExport = function() {
            var numDocs = $scope.export.numDocuments;

            HeatMapSourceGeneratorService.startCsvExport(numDocs);
        };

        $scope.showExportInfo = function() {
            InfoService.showInfoPopup('export');
        };

    }
})();
