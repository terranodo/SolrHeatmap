(function() {

angular
  .module('search_timehistogram_component', [])
  .directive('timeHistogram', timeHistogram);

function timeHistogram() {
  var directive = {
    templateUrl: 'app/components/histogram/histogram.html',
    restrict: 'EA',
    link: link
  };
  return directive;

  function link(scope, element) {

    scope.$on('setHistogram', function(even, histogram) {
      makeHistogram(histogram);
    });

    function makeHistogram(histogram) {

      findHistogramMaxValue();
      renderingSvgBars();

      function findHistogramMaxValue() {
        histogram.maxValue = Math.max.apply(null, histogram.counts.map(function(obj) {
          return obj.count;
        }));
      }

      function renderingSvgBars() {
        if (histogram.counts) {
          histogram.barsWidth = $('#bars').width();
          var barsheight = 60;
          var rectWidth = histogram.barsWidth / histogram.counts.length;
          var svgRect = histogram.counts.map(function(bar, barKey) {
            var height = histogram.maxValue === 0 ? 0 : barsheight * bar.count / histogram.maxValue;
            var y = barsheight - height;
            var translate = (rectWidth + 2) * barKey;
            return '<g transform="translate(' + translate + ', 0)">' +
                   '  <rect width="' + rectWidth + '" height="' + height + '" y="' + y + '" fill="#B0B0B0"></rect>' +
                   '</g>';
          });
          var svgbar = '<svg width="100%" height="' + barsheight + '">' + svgRect.join('') + '</svg>';
          $('#bars').html(svgbar);
        }
      }
    }
  }
}

}());
