/*eslint angular/di: [2,"array"]*/
/*eslint angular/controller-as: 0*/
/**
 * ResultCounter Controller
 */

(function() {
    angular
    .module('search_heatmap_component', [])
    .directive('heatmap', heatmap);

    function heatmap() {
        return {
            restrict: 'EA',
            templateUrl: 'components/heatmap/heatmap.tpl.html',
            scope: {}
        };
    }

    function setTooltip() {
        var tooltip = document.getElementById('tooltip');
        var overlay = new ol.Overlay({
            element: tooltip,
            offset: [10, 0],
            positioning: 'bottom-left'
        });
        map.addOverlay(overlay);

        function displayTooltip(evt) {
            var pixel = evt.pixel;
            var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                return feature;
            });
            tooltip.style.display = feature ? '' : 'none';
            if (feature) {
                overlay.setPosition(evt.coordinate);
                tooltip.innerHTML = feature.get('name');
            }
        }
        map.on('pointermove', displayTooltip);
    }

})();
