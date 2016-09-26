describe( 'UserFilterDirective', function() {
    var $scope, scope, rootScope, HeatMapSourceGeneratorService, InfoService, element, compiledElement;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function($compile, $controller, $rootScope, _HeatMapSourceGenerator_, _InfoService_) {
        rootScope = $rootScope;
        $scope = $rootScope.$new();

        element = angular.element('<user-filter></user-filter>');
        compiledElement = $compile(element)($scope);
        $scope.$digest();
        scope = compiledElement.isolateScope();

        HeatMapSourceGeneratorService = _HeatMapSourceGenerator_;
        InfoService = _InfoService_;
    }));
    it( 'searchInput is empty string', function() {
        expect(scope.userfilterInput).toEqual('');
    });
    describe('#userSearch', function() {
        var setUserSpy, searchSpy;
        beforeEach(function() {
            setUserSpy = spyOn(HeatMapSourceGeneratorService.filterObj, 'setUser');
            searchSpy = spyOn(HeatMapSourceGeneratorService, 'performSearch');
        });
        describe('calls search on HeatMapSourceGeneratorService', function() {
            it('once', function() {
                scope.userSearch();
                expect(searchSpy).toHaveBeenCalledTimes(1);
            });
            it('set user', function() {
                scope.userfilterInput = 'San Diego';
                scope.userSearch();
                expect(setUserSpy).toHaveBeenCalledWith('San Diego');
            });
        });
    });
    describe('#showInfo', function() {
        it('opens the modal info', function() {
            var modalSpy = spyOn(InfoService, 'showInfoPopup');
            scope.showUserFilterInfo();
            expect(modalSpy).toHaveBeenCalledTimes(1);
        });
    });
});
