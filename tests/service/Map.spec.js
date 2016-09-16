describe( 'HeatMapSourceGenerator', function() {
    var subject, NormalizeService, olSpy, mapSpy, viewSpy, mapViewSpy, defaultConfig, defaultViewConfig;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function( _Map_, _Normalize_) {
        subject = _Map_;
        NormalizeService = _Normalize_;
        mapViewSpy = jasmine.createSpyObj('view', ['set']);
        mapSpy = jasmine.createSpyObj('map', ['getView']);
        mapSpy.getView.and.returnValue(mapViewSpy);
        olSpy = spyOn(ol, 'Map').and.returnValue(mapSpy);
        viewSpy = spyOn(ol, 'View');
        defaultConfig = { mapConfig: { view: {}}};
        defaultViewConfig = { center: [0, 0 ], maxZoom: undefined, minZoom: undefined, projection: 'EPSG:3857', resolution: undefined, resolutions: undefined, rotation: undefined, zoom: 2, zoomFactor: undefined };
    }));

    describe('#init', function() {
        it('creates an OL map', function() {
            subject.init(defaultConfig);
            expect(olSpy).toHaveBeenCalled();
        });
        it('has a default config', function() {
            subject.init(defaultConfig);
            expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
        });
        describe('can change settings',  function() {
            it('change zoom', function() {
                defaultConfig = { mapConfig: { view: { zoom: 3}}};
                defaultViewConfig.zoom = 3;
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change resoltion', function() {
                defaultConfig = { mapConfig: { view: { resolution: '10'}}};
                defaultViewConfig.resolution = '10';
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change rotation', function() {
                defaultConfig = { mapConfig: { view: { rotation: 1}}};
                defaultViewConfig.rotation = 1;
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change zoomFactor', function() {
                defaultConfig = { mapConfig: { view: { zoomFactor: 1}}};
                defaultViewConfig.zoomFactor = 1;
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change minZoom', function() {
                defaultConfig = { mapConfig: { view: { minZoom: 1}}};
                defaultViewConfig.minZoom = 1;
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change maxZoom', function() {
                defaultConfig = { mapConfig: { view: { maxZoom: 1}}};
                defaultViewConfig.maxZoom = 1;
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
            it('change resolutions', function() {
                defaultConfig = { mapConfig: { view: { resolutions: [0,0]}}};
                defaultViewConfig.resolutions = [0,0];
                subject.init(defaultConfig);
                expect(viewSpy).toHaveBeenCalledWith(defaultViewConfig);
            });
        });
        it('can change the view extent', function() {
            generetaeMaskSpy = spyOn(subject, 'generateMaskAndAssociatedInteraction');
            defaultConfig = { mapConfig: { view: { extent: [0,0]}}};
            subject.init(defaultConfig);
            expect(mapSpy.getView).toHaveBeenCalled();
            expect(mapViewSpy.set).toHaveBeenCalled();
            expect(generetaeMaskSpy).toHaveBeenCalled();
        });
        describe('broken config', function() {
            it('sets renderer to undefined', function() {
                defaultConfig = { mapConfig: { view: '' , renderer: 1}};
                subject.init(defaultConfig);
                expect(olSpy).toHaveBeenCalled();
            });
        });
    });
});
