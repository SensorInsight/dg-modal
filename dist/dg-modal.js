angular.module('dgModal', []);

angular.module('dgModal').service('dgModal', ['$document','$timeout',
    function($document, $timeout){

      this.display = function(){
        angular.element(document.querySelector('.page')).addClass('freeze');
        angular.element(document.querySelector('.map-action-sheet')).addClass('show');

        $timeout(function(){
          angular.element(document.querySelector('.map-action-sheet')).addClass('display');
        },10);

      };

      this.close = function(){
        angular.element(document.querySelector('.map-action-sheet')).removeClass('display');

        $timeout(function(){
          angular.element(document.querySelector('.map-action-sheet')).removeClass('show');
          angular.element(document.querySelector('.page')).removeClass('freeze');
        },100);//needs a lil longer to properly let animations dismiss before removing
      };

    }
]);

angular.module('dgModal').directive('dgModal', ['$log','$http','$compile','$document','dgModal',
  function($log, $http, $compile, $document, dgModal){
    return{
      restrict: 'EA',
      scope:{
        content: '@'
      },
      template: '<div class=\'map-action-sheet \'><div class=\'map-action-sheet-content\'></div></div>',
      replace: true,
      link:function(scope, elm, attrs){

        //display action sheet
        scope.closeActionSheet = function () {
            dgModal.close()
        };

        scope.openActionSheet = function() {
            dgModal.display()
        };

        if(!scope.content){
          $log.error('You have not specified any content for the action sheet');
          return
        }else{

          $http.get(scope.content).then(function (htmlTemplate) {
            var tmp = angular.element(document.querySelector('.map-action-sheet-content')).html(htmlTemplate.data);
            $compile(tmp)(scope);
          }, function(err){
            $log.error(err);
          })


        }


      }
    }
  }
]);