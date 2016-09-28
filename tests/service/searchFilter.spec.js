describe( 'searchFilter', function() {
    var subject;

    beforeEach( module( 'SolrHeatmapApp' ) );

    beforeEach( inject( function( _searchFilter_) {
        subject = _searchFilter_;
    }));

    it('has geo default filter', function() {
        expect(subject.geo).toEqual('[-90,-180 TO 90,180]');
    });
    it('has default text filter', function() {
        expect(subject.text).toEqual(null);
    });
    it('has default user filter', function() {
        expect(subject.user).toEqual(null);
    });
    describe('#setFilter', function() {
        it('sets the user', function() {
            subject.setFilter({user: 'Diego'});
            expect(subject.user).toEqual('Diego');
        });
        it('sets the text', function() {
            subject.setFilter({text: 'San Diego'});
            expect(subject.text).toEqual('San Diego');
        });
        it('sets the geo', function() {
            subject.setFilter({geo: '[2,1 TO 2,1]'});
            expect(subject.geo).toEqual('[2,1 TO 2,1]');
        });
    });
});
