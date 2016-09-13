/*eslint angular/di: [2,'array']*/
/*eslint angular/document-service: 2*/
/*eslint max-len: [2,150]*/
/**
 * HeatMapSourceGenerator Service
 */
(function() {
    angular
    .module('SolrHeatmapApp')
    .factory('InfoService', ['$uibModal', function($uibModal) {

        return {
            showInfoPopup: showInfoPopup
        };

        function showInfoPopup(infoMsg, toolName){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'infoPopup.html',
                controller: 'InfoWindowController',
                size: 'lg',
                resolve: {
                    infoMsg: function(){
                        return infoMsg;
                    },
                    toolName: function(){
                        return toolName;
                    }
                }
            });
        }
    }]);

})();
