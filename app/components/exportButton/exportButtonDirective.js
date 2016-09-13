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

    ExportController.$inject = ['HeatMapSourceGenerator', '$uibModal', '$scope'];
    function ExportController(HeatMapSourceGeneratorService, $uibModal, $scope) {

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

        $scope.showInfo = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'infoPopup.html',
                controller: 'InfoWindowController',
                size: 'lg',
                resolve: {
                    infoMsg: function(){
                        return solrHeatmapApp.instructions.export.instruction;
                    },
                    toolName: function(){
                        return solrHeatmapApp.instructions.export.toolTitle;
                    }
                }
            });
        };

    }
})();
