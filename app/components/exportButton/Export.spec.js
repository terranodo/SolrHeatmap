describe( 'ExportController', function() {
    var ExportController, scope, rootScope, HeatMapSourceGeneratorService, uibModal, compiledElement;

    beforeEach(module('SolrHeatmapApp'));
    beforeEach(module('search_exportButton_component'));

    beforeEach(inject( function($compile, $controller, $rootScope, _HeatMapSourceGenerator_, _$uibModal_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();

        var element = angular.element('<export-button></exportButton>');
        compiledElement = $compile(element)(scope);
        scope.$digest();

        HeatMapSourceGeneratorService = _HeatMapSourceGenerator_;
        uibModal = _$uibModal_;

    }));

    it( 'export has defaults', function() {
        expect(compiledElement.scope().export.numDocuments).toEqual(1);
    });
    describe('#startExport', function() {
        var startExportSpy;
        beforeEach(function() {
            startExportSpy = spyOn(HeatMapSourceGeneratorService, 'startCsvExport');
        });
        describe('calls search on HeatMapSourceGeneratorService', function() {
            it('once', function() {
                compiledElement.scope().startExport();
                expect(startExportSpy).toHaveBeenCalledTimes(1);
            });
            it('with number of docs', function() {
                compiledElement.scope().export.numDocuments = 10;
                compiledElement.scope().startExport();
                expect(startExportSpy).toHaveBeenCalledWith(10);
            });
        });
    });
    describe('#showInfo', function() {
        it('opens the modal info', function() {
            var modalSpy = spyOn(uibModal, 'open');
            compiledElement.scope().showExportInfo();
            expect(modalSpy).toHaveBeenCalledTimes(1);
        });
    });
});
