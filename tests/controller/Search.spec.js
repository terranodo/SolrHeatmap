describe( 'SearchController', function() {
    var SearchController, $scope, rootScope, HeatMapSourceGeneratorService, MapService;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function( $controller, $rootScope, _HeatMapSourceGenerator_, _Map_) {
        rootScope = $rootScope;
        $scope = $rootScope.$new();
        HeatMapSourceGeneratorService = _HeatMapSourceGenerator_;
        MapService = _Map_;
        SearchController = $controller( 'SearchController', { $scope: $scope });
    }));
    it( 'searchInput is empty string', function() {
        expect($scope.searchInput).toEqual('');
    });
    describe('#doSearch', function() {
        var searchSpy;
        beforeEach(function() {
             searchSpy = spyOn(HeatMapSourceGeneratorService, 'search');
        });
        describe('calls search on HeatMapSourceGeneratorService', function() {
            it('once', function() {
                $scope.doSearch();
                expect(searchSpy).toHaveBeenCalledTimes(1);
            });
            it('with searchInput', function() {
                $scope.searchInput = 'San Diego';
                $scope.doSearch();
                expect(searchSpy).toHaveBeenCalledWith('San Diego');
            });
        });
    });
    describe('#resetSearchInput', function() {
        var searchSpy, mapSpy;
        beforeEach(function() {
            searchSpy = spyOn(HeatMapSourceGeneratorService, 'search');
            mapSpy = spyOn(MapService, 'resetMap');
            $scope.searchInput = 'San Diego';
        });
        describe('calls search on HeatMapSourceGeneratorService', function() {
            it('once', function() {
                $scope.resetSearchInput();
                expect(searchSpy).toHaveBeenCalledTimes(1);
            });
            it('with searchInput', function() {
                $scope.resetSearchInput();
                expect(searchSpy).toHaveBeenCalledWith('');
            });
        });
    });
});
