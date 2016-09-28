/*eslint angular/di: [2,"array"]*/
/*eslint angular/document-service: 2*/
/*eslint max-len: [2,100]*/
/**
 * Map service
 */
(function() {
    angular.module('SolrHeatmapApp')
    .factory('Map', ['$rootScope', '$filter', '$document', 'Normalize', '$controller',
        function($rootScope, $filter, $document, Normalize, $controller) {
            var NormalizeService = Normalize;
            var service = {};
            var map = {},
                defaults = {
                    renderer: 'canvas',
                    view: {
                        center: [0 ,0],
                        projection: 'EPSG:3857',
                        zoom: 2
                    }
                },
                rs = $rootScope;

            /**
             *
             */
            function buildMapLayers(layerConfig) {
                var layer,
                    layers = [];

                if (angular.isArray(layerConfig)) {
                    angular.forEach(layerConfig, function(conf) {
                        if (conf.type === 'TileWMS') {
                            layer = new ol.layer.Tile({
                                name: conf.name,
                                backgroundLayer: conf.backgroundLayer,
                                displayInLayerPanel: conf.displayInLayerPanel,
                                source: new ol.source.TileWMS({
                                    attributions: [new ol.Attribution({
                                        html: conf.attribution
                                    })],
                                    crossOrigin: conf.crossOrigin,
                                    logo: conf.logo,
                                    params: conf.params,
                                    ratio: conf.ratio,
                                    resolutions: conf.resoltions,
                                    url: conf.url
                                }),
                                opacity: conf.opacity,
                                visible: conf.visible
                            });
                        }
                        if (conf.type === 'ImageWMS') {
                            layer = new ol.layer.Image({
                                name: conf.name,
                                backgroundLayer: conf.backgroundLayer,
                                displayInLayerPanel: conf.displayInLayerPanel,
                                source: new ol.source.ImageWMS({
                                    attributions: [new ol.Attribution({
                                        html: conf.attribution
                                    })],
                                    crossOrigin: conf.crossOrigin,
                                    logo: conf.logo,
                                    params: conf.params,
                                    resolutions: conf.resoltions,
                                    url: conf.url
                                }),
                                opacity: conf.opacity,
                                visible: conf.visible
                            });
                        }
                        layers.push(layer);
                    });
                }
                return layers;
            }

            /**
            *
            */
            service.getMap = function() {
                return map;
            };

            service.getMapView = function() {
                return service.getMap().getView();
            };

            service.getMapZoom = function() {
                return service.getMapView().getZoom();
            };

            service.getMapSize = function() {
                return service.getMap().getSize();
            };

            service.getMapProjection = function() {
                return service.getMapView().getProjection().getCode();
            };

            service.getLayers = function() {
                return service.getMap().getLayers().getArray();
            };

            service.getInteractions = function () {
                return service.getMap().getInteractions().getArray();
            };

            service.getLayersBy = function(key, value) {
                var layers = service.getLayers();
                return $filter('filter')(layers, function(layer) {
                    return layer.get(key) === value;
                });
            };

            /**
             *
             */
            service.getInteractionsByClass = function(value) {
                var interactions = service.getInteractions();
                return $filter('filter')(interactions, function(interaction) {
                    return interaction instanceof value;
                });
            };

            /**
             *
             */
            service.getInteractionsByType = function(interactions, type) {
                return $filter('filter')(interactions, function(interaction) {
                    return interaction.type_ === type;
                });
            };

            /**
            * Helper method to change active mode of masks for backgroundLayer and
            * heatmap layer
            */
            var _switchMasks = function(hmAvailable) {
                var heatMapLayer = service.getLayersBy('name', 'HeatMapLayer')[0],
                    heatMapMask = heatMapLayer.getFilters()[0],
                    backgroundLayer = service.getLayersBy('backgroundLayer', true)[0],
                    backgroundLayerMask = backgroundLayer.getFilters()[0];

                // disable mask of backgroundLayer if heatmap is available and vice versa
                backgroundLayerMask.setActive(!hmAvailable);
                // enable mask of heatMapLayer if heatmap is available and vice versa
                heatMapMask.setActive(hmAvailable);
            };

            function heatmapMinMax(heatmap, stepsLatitude, stepsLongitude){
                var max = -1;
                var min = Number.MAX_VALUE;
                for (var i = 0 ; i < stepsLatitude ; i++){
                    var currentRow = heatmap[i];
                    if (currentRow === null){
                        heatmap[i] = currentRow = [];
                    }
                    for (var j = 0 ; j < stepsLongitude ; j++){
                        if (currentRow[j] === null){
                            currentRow[j] = -1;
                        }

                        if (currentRow[j] > max){
                            max = currentRow[j];
                        }

                        if (currentRow[j] < min && currentRow[j] > -1){
                            min = currentRow[j];
                        }
                    }
                }
                return [min, max];
            }

            function rescaleHeatmapValue(value, minMaxValue){
                if (value === null){
                    return 0;
                }

                if (value === -1){
                    return -1;
                }

                if (value === 0){
                    return 0;
                }

                if ((minMaxValue[1] - minMaxValue[0]) === 0){
                    return 0;
                }

                return (value - minMaxValue[0]) / (minMaxValue[1] - minMaxValue[0]);
            }

            /*
             *
             */
            function createHeatMapSource(hmParams) {
                var counts_ints2D = hmParams.counts_ints2D,
                    gridLevel = hmParams.gridLevel,
                    gridColumns = hmParams.columns,
                    gridRows = hmParams.rows,
                    minX = hmParams.minX,
                    minY = hmParams.minY,
                    maxX = hmParams.maxX,
                    maxY = hmParams.maxY,
                    hmProjection = hmParams.projection,
                    dx = maxX - minX,
                    dy = maxY - minY,
                    sx = dx / gridColumns,
                    sy = dy / gridRows,
                    olFeatures = [],
                    minMaxValue,
                    sumOfAllVals = 0,
                    olVecSrc;

                if (!counts_ints2D) {
                    return null;
                }
                minMaxValue = heatmapMinMax(counts_ints2D, gridRows, gridColumns);
                for (var i = 0 ; i < gridRows ; i++){
                    for (var j = 0 ; j < gridColumns ; j++){
                        var hmVal = counts_ints2D[counts_ints2D.length-i-1][j],
                            lon,
                            lat,
                            feat,
                            coords;

                        if (hmVal && hmVal !== null){
                            lat = minY + i*sy + (0.5 * sy);
                            lon = minX + j*sx + (0.5 * sx);
                            coords = ol.proj.transform(
                              [lon, lat],
                              hmProjection,
                              map.getView().getProjection().getCode()
                            );

                            feat = new ol.Feature({
                                geometry: new ol.geom.Point(coords)
                            });

                            // needs to be rescaled.
                            var scaledValue = rescaleHeatmapValue(hmVal,minMaxValue);
                            feat.set('weight', scaledValue);
                            feat.set('origVal', hmVal);

                            olFeatures.push(feat);
                        }
                    }
                }

                olVecSrc = new ol.source.Vector({
                    features: olFeatures,
                    useSpatialIndex: true
                });
                return olVecSrc;
            }

            service.createOrUpdateHeatMapLayer = function(data) {
                var existingHeatMapLayers, transformInteractionLayer, olVecSrc, newHeatMapLayer;
                existingHeatMapLayers = service.getLayersBy('name', 'HeatMapLayer');
                transformInteractionLayer = service.getLayersBy('name',
                                                                "TransformInteractionLayer")[0];
                olVecSrc = createHeatMapSource(data);

                if (existingHeatMapLayers && existingHeatMapLayers.length > 0){
                    var currHeatmapLayer = existingHeatMapLayers[0];
                    // Update layer source
                    var layerSrc = currHeatmapLayer.getSource();
                    if (layerSrc){
                        layerSrc.clear();
                    }
                    currHeatmapLayer.setSource(olVecSrc);
                } else {
                    newHeatMapLayer = new ol.layer.Heatmap({
                        name: 'HeatMapLayer',
                        source: olVecSrc,
                        radius: 10
                    });

                    service.getMap().addLayer(newHeatMapLayer);

                    // Add Mask to HeatMapLayer
                    var currentBBox = transformInteractionLayer.getSource().getFeatures()[0];

                    var mask = new ol.filter.Mask({
                        feature: currentBBox,
                        inner: false,
                        fill: new ol.style.Fill({
                            color: [255,255,255,0.5]
                        })
                    });
                    newHeatMapLayer.addFilter(mask);
                }
                _switchMasks(olVecSrc !== null);
            };

            /**
             * This method adds a transfrom interaction to the mapand a mask to background layer
             * The area outer the feature which can be modified by the transfrom interaction
             * will have a white shadow
             */
            function generateMaskAndAssociatedInteraction(bboxFeature, fromSrs) {
                var polygon = new ol.Feature(ol.geom.Polygon.fromExtent(bboxFeature)),
                    backGroundLayer = service.getLayersBy('backgroundLayer', true)[0];

                if (fromSrs !== service.getMapProjection()){
                    var polygonNew = ol.proj.transformExtent(bboxFeature, fromSrs,
                                                    service.getMapProjection());
                    polygon = new ol.Feature(ol.geom.Polygon.fromExtent(polygonNew));
                }

                // TransformInteractionLayer
                // holds the value of q.geo
                var vector = new ol.layer.Vector({
                    name: 'TransformInteractionLayer',
                    source: new ol.source.Vector(),
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [255,255,255,0.01]
                        })
                    })
                });
                service.getMap().addLayer(vector);
                vector.getSource().addFeature(polygon);

                var transformInteraction = new ol.interaction.Transform({
                    translate: true,
                    scale: true,
                    translateFeature: false,
                    rotate: false,
                    stretch: false
                });
                service.getMap().addInteraction(transformInteraction);

                var mask = new ol.filter.Mask({
                    feature: polygon,
                    inner:false,
                    fill: new ol.style.Fill({
                        color:[255,255,255,0.5]
                    })
                });
                backGroundLayer.addFilter(mask);
            }

            function setTransactionBBox(extent) {
                var transformationLayer = service.getLayersBy('name',
                                                              'TransformInteractionLayer')[0],
                    vectorSrc = transformationLayer.getSource(),
                    currentBbox = vectorSrc.getFeatures()[0],
                    polyNew;

                polyNew = ol.geom.Polygon.fromExtent(extent);
                currentBbox.setGeometry(polyNew);

                // update interaction
                service.getInteractions().forEach(function(interaction){
                    if(interaction instanceof ol.interaction.Transform){
                        interaction.dispatchEvent('propertychange');
                    }
                });
            }

            /*
             * For change:resolution event (zoom in map):
             * If bounding of transform interaction is grater than the map extent
             * the transform box will be resized to 90%
             */
            service.checkBoxOfTransformInteraction = function() {
                var transformInteractionLayer = service.getLayersBy('name',
                                                                    'TransformInteractionLayer')[0],
                    mapExtent = service.getMapView().calculateExtent(service.getMapSize()),
                    vectorSrc = transformInteractionLayer.getSource(),
                    currentBbox = vectorSrc.getFeatures()[0],
                    needsUpdate = false,
                    ordArray = currentBbox.getGeometry().getCoordinates()[0];

                // check if current bbox is greater than map extent
                for (var i = 0; i<ordArray.length; i++) {
                    if (! new ol.geom.Point(ordArray[i]).intersectsExtent(mapExtent)){
                        needsUpdate = true;
                        break;
                    }
                }

                if (needsUpdate === true) {
                    // calculate reduced bounding box
                    var minx = mapExtent[0],
                        miny = mapExtent[1],
                        maxx = mapExtent[2],
                        maxy = mapExtent[3],
                        dx = maxx - minx,
                        dy = maxy - miny,
                        minInnerX = minx + (1 - solrHeatmapApp.appConfig.ratioInnerBbox) * dx,
                        maxInnerX = minx + (solrHeatmapApp.appConfig.ratioInnerBbox) * dx,
                        minInnerY = miny + (1 - solrHeatmapApp.appConfig.ratioInnerBbox) * dy,
                        maxInnerY = miny + (solrHeatmapApp.appConfig.ratioInnerBbox) * dy;

                    setTransactionBBox([ minInnerX, minInnerY, maxInnerX, maxInnerY]);
                }

            };

            /**
             * Helper method to reset the map
             */
            service.resetMap = function() {
                // Reset view
                var intitalCenter = solrHeatmapApp.initMapConf.view.center,
                    intitalZoom = solrHeatmapApp.initMapConf.view.zoom;
                if (intitalZoom && intitalCenter) {
                    var vw = service.getMapView();
                    vw.setCenter(intitalCenter);
                    vw.setZoom(intitalZoom);

                    setTransactionBBox(solrHeatmapApp.initMapConf.view.extent);
                }
            };

            service.createQueryFromExtent = function(extent) {
                return '[' + extent.minX +
                    ',' + extent.minY +
                    ' TO ' + extent.maxX +
                    ',' + extent.maxY + ']';
            };

            service.getExtentFromQuery = function(query) {
                var extent, min, max,
                    extentSplit = function(extentString) {
                        return extentString.split(',');
                    };
                extent = query.replace(/\[|\]/g,'').split(' TO ');
                min = extentSplit(extent[0]);
                max = extentSplit(extent[1]);
                return {
                    minX: parseInt(min[0], 10),
                    minY: parseInt(min[1], 10),
                    maxX: parseInt(max[0], 10),
                    maxY: parseInt(max[1], 10)};
            };

            service.calculateReducedBoundingBox = function(extent) {
                if(solrHeatmapApp.appConfig) {
                    var dx = extent.maxX - extent.minX,
                        dy = extent.maxY - extent.minY,
                        minX = extent.minX + (1 - solrHeatmapApp.appConfig.ratioInnerBbox) * dx,
                        maxX = extent.minX + (solrHeatmapApp.appConfig.ratioInnerBbox) * dx,
                        minY = extent.minY + (1 - solrHeatmapApp.appConfig.ratioInnerBbox) * dy,
                        maxY = extent.minY + (solrHeatmapApp.appConfig.ratioInnerBbox) * dy;
                    return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
                }
                return extent;
            };

            service.getReducedQueryFromExtent = function(extentQuery) {
                var extent = service.getExtentFromQuery(extentQuery);
                return service.createQueryFromExtent(service.calculateReducedBoundingBox(extent));
            };

            service.getCurrentExtentQuery = function(){
                return service.createQueryFromExtent(service.getCurrentExtent());
            };

            service.getExtentForProjectionFromQuery = function(query, projection) {
                var extentObj = service.getExtentFromQuery(query);
                var extent = NormalizeService.normalizeExtent([
                    extentObj.minY,
                    extentObj.minX,
                    extentObj.maxY,
                    extentObj.maxX]);
                return ol.proj.transformExtent(extent, 'EPSG:4326', projection);

            };

            /**
             * Builds geospatial filter depending on the current map extent.
             * This filter will be used later for `q.geo` parameter of the API
             * search or export request.
             */
            service.getCurrentExtent = function(){
                var viewProj = service.getMapProjection(),
                    extent = service.getMapView().calculateExtent(service.getMapSize()),
                    extentWgs84 = ol.proj.transformExtent(extent, viewProj, 'EPSG:4326'),
                    transformInteractionLayer = service.
                                    getLayersBy('name', 'TransformInteractionLayer')[0],
                    currentBbox,
                    currentBboxExtentWgs84,
                    currentExtent = {};

                if (!transformInteractionLayer) {
                    return null;
                }
                currentBbox = transformInteractionLayer.getSource().getFeatures()[0];
                currentBboxExtentWgs84 = ol.proj.transformExtent(
                                currentBbox.getGeometry().getExtent(), viewProj, 'EPSG:4326');

                // default: Zoom level <= 1 query whole world
                if (service.getMapZoom() <= 1) {
                    extentWgs84 = [-180, -90 ,180, 90];
                }

                if (extent && extentWgs84){
                    var normalizedExtentMap = NormalizeService.normalizeExtent(extentWgs84),
                        normalizedExtentBox =
                            NormalizeService.normalizeExtent(currentBboxExtentWgs84),
                        minX = normalizedExtentMap[1],
                        maxX = normalizedExtentMap[3],
                        minY = normalizedExtentMap[0],
                        maxY = normalizedExtentMap[2];

                    minX = normalizedExtentBox[1];
                    maxX = normalizedExtentBox[3];
                    minY = normalizedExtentBox[0];
                    maxY = normalizedExtentBox[2];

                    currentExtent = {
                        minX: minX,
                        maxX: maxX,
                        minY: minY,
                        maxY: maxY
                    };

                    var roundToFixed = function(value){
                        return parseFloat(Math.round(value* 100) / 100).toFixed(2);
                    };
                    // Reset the date fields
                    $rootScope.$broadcast('geoFilterUpdated', '[' +
                                            roundToFixed(minX) + ',' +
                                            roundToFixed(minY) + ' TO ' +
                                            roundToFixed(maxX) + ',' +
                                            roundToFixed(maxY) + ']');
                }

                return currentExtent;
            };

            /**
             *
             */
            service.init = function(config) {
                var viewConfig = angular.extend(defaults.view,
                                                    config.mapConfig.view),
                    rendererConfig = config.mapConfig.renderer ?
                        config.mapConfig.renderer : defaults.renderer,
                    layerConfig = config.mapConfig.layers;

                map = new ol.Map({
                    controls: ol.control.defaults().extend([
                        new ol.control.ScaleLine(),
                        new ol.control.ZoomSlider()
                    ]),
                    interactions: ol.interaction.defaults(),
                    layers: buildMapLayers(layerConfig),
                    renderer: angular.isString(rendererConfig) ?
                                            rendererConfig : undefined,
                    target: 'map',
                    view: new ol.View({
                        center: angular.isArray(viewConfig.center) ?
                                viewConfig.center : undefined,
                        maxZoom: angular.isNumber(viewConfig.maxZoom) ?
                                viewConfig.maxZoom : undefined,
                        minZoom: angular.isNumber(viewConfig.minZoom) ?
                                viewConfig.minZoom : undefined,
                        projection: angular.isString(viewConfig.projection) ?
                                viewConfig.projection : undefined,
                        resolution: angular.isString(viewConfig.resolution) ?
                                viewConfig.resolution : undefined,
                        resolutions: angular.isArray(viewConfig.resolutions) ?
                                viewConfig.resolutions : undefined,
                        rotation: angular.isNumber(viewConfig.rotation) ?
                                viewConfig.rotation : undefined,
                        zoom: angular.isNumber(viewConfig.zoom) ?
                                viewConfig.zoom : undefined,
                        zoomFactor: angular.isNumber(viewConfig.zoomFactor) ?
                                viewConfig.zoomFactor : undefined
                    })
                });

                if (angular.isArray(viewConfig.extent)) {
                    var vw = map.getView();
                    vw.set('extent', viewConfig.extent);
                    generateMaskAndAssociatedInteraction(viewConfig.extent, viewConfig.projection);
                }
            };
            return service;
        }]
);
})();
