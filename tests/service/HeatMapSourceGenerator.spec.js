describe( 'MainController', function() {
    var subject;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function( _HeatMapSourceGenerator_) {
        subject = _HeatMapSourceGenerator_;
    }));

    describe('#getFormattedDateString', function() {
        it('Returns the formatted date object that can be parsed by API.', function() {
            var startDate = new Date('2016-09-08');
            expect(subject.getFormattedDateString(startDate, startDate)).toEqual('[2016-09-08T00:00:00 TO 2016-09-08T00:00:00]');
        });
    });
});
