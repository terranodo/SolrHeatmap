describe( 'HeatMapSourceGenerator', function() {
    var subject, $httpBackend;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function( _HeatMapSourceGenerator_, _$httpBackend_) {
        subject = _HeatMapSourceGenerator_;
        $httpBackend = _$httpBackend_;
    }));

    describe('#getFormattedDateString', function() {
        it('Returns the formatted date object that can be parsed by API.', function() {
            var startDate = new Date('2016-09-08');
            expect(subject.getFormattedDateString(startDate, startDate)).toEqual('[2016-09-08T00:00:00 TO 2016-09-08T00:00:00]');
        });
    });
    describe('#startCsvExport', function() {
        var spatialSpy, queryParamSpy, exportRequest, geospatialFilter;
        beforeEach(function() {
            solrHeatmapApp.bopwsConfig = { csvDocsLimit: 10 };
            solrHeatmapApp.appConfig = { tweetsExportBaseUrl: '/export' };
            geospatialFilter = {queryGeo: { minX: 1, maxX: 1, minY: 1, maxY: 1}};
            spatialSpy = spyOn(subject, 'getGeospatialFilter').and.returnValue(geospatialFilter);
            queryParamSpy = spyOn(subject, 'getTweetsSearchQueryParameters').and.returnValue({});
            exportRequest = $httpBackend.when('GET', '/export?d.docs.limit=10').respond('');
        });
        afterEach(function() {
            $httpBackend.resetExpectations();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        it('sends the export request', function() {
            $httpBackend.expectGET('/export?d.docs.limit=10').respond('');
            subject.startCsvExport();
            $httpBackend.flush();
        });
        it('sends the export request with numberofDocuments', function() {
            $httpBackend.expectGET('/export?d.docs.limit=20').respond('');
            subject.startCsvExport(20);
            $httpBackend.flush();
        });
        it('calls getTweetsSearchQueryParameters', function() {
            subject.startCsvExport();
            expect(queryParamSpy).toHaveBeenCalledTimes(1);
            $httpBackend.flush();
        });
        it('call getTweetsSearchQueryParameters with bounds', function() {
            subject.startCsvExport();
            expect(queryParamSpy).toHaveBeenCalledWith({minX: 1, maxX: 1, minY: 1, maxY: 1});
            $httpBackend.flush();
        });
        describe('no geospatial filter', function() {
            beforeEach(function() {
                spatialSpy.and.returnValue(null);
            });
            afterEach(function() {
                $httpBackend.resetExpectations();
            });
            it('does not send the export request', function() {
                subject.startCsvExport();
                expect($httpBackend.flush).toThrow();
            });
        });
        describe('error from server', function() {
            it('throws an window error', inject(function($window) {
                exportRequest.respond(401, '');
                spyOn( $window, 'alert' ).and.callFake( function() {
                    return true;
                } );
                subject.startCsvExport();
                $httpBackend.flush();
                expect($window.alert).toHaveBeenCalled();
            }));
        });
    });
});
