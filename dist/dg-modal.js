angular.module('dgModal', []);

angular.module('dgModal').service('dgModal', ['$document','$timeout','$q','$window',
    function($document, $timeout, $q, $window){

      var self = this;
      self.style = null;

      self.setStyle = function(style){
        self.style = style;
      }

      self.display = function(){
        var deferred = $q.defer();

        //reset position to center for desktop
        if($window.innerWidth >= 1224){

          switch(self.style){
            case 'fromLeft':
              self.css = {
                "top": "0",
                "left":"0",
                "height":"100%",
              }
              break;
            case 'center':
              self.css = {
                "top": "11%",
                "left":"20%",
              }
              break;
            default:
              self.css = {
                "top": "11%",
                "left":"20%",
              }
          }

          angular.element(document.querySelector('.dg-modal')).css(self.css);          

        }


        angular.element(document.querySelector('.page')).addClass('freeze');
        angular.element(document.querySelector('.dg-modal')).addClass('show');

        $timeout(function(){
          angular.element(document.querySelector('.dg-modal')).addClass('display');
          deferred.resolve();
        },50);
        
        return deferred.promise
      };

      self.close = function(){
        var deferred = $q.defer();
        
        angular.element(document.querySelector('.dg-modal')).removeClass('display');

        $timeout(function(){
          angular.element(document.querySelector('.dg-modal')).removeClass('show');
          angular.element(document.querySelector('.page')).removeClass('freeze');
          deferred.resolve();
        },100);//needs a lil longer to properly let animations dismiss before removing
        
        return deferred.promise
      };
     
    }
]);

angular.module('dgModal').directive('dgModal', ['$log','$http','$compile','$document','dgModal','$templateCache',
  function($log, $http, $compile, $document, dgModal, $templateCache){
    return{
      restrict: 'EA',
      scope:{
        content: '@',
        component: '@',
        enter: '=enter',
        useCache: '='
      },
      template: '<div class=\'dg-modal \'><div class=\'dg-modal-content\'></div></div>',
      replace: true,
      link:function(scope, elm, attrs){

        if(scope.enter){
          dgModal.setStyle(scope.enter);
        }

        //display action sheet
        scope.closeActionSheet = function () {
            dgModal.close()
        };

        scope.openActionSheet = function() {
            dgModal.display()
        };

        if(!scope.content && !scope.component){
          $log.error('You have not specified a component or content template for the action sheet');
          return
        }else{

          if(scope.useCache){
            var htmlTemplate = $templateCache.get(scope.content);
            var tmp = angular.element(document.querySelector('.dg-modal-content')).html(htmlTemplate);
            $compile(tmp)(scope);
          }else if(scope.component && !scope.content){
            var component = "<" + scope.component + "></"+ scope.component +">";
            
            var tmp = angular.element(document.querySelector('.dg-modal-content')).html(component);
            $compile(tmp)(scope);

        }else if(scope.content && !scope.component){
            $http.get(scope.content).then(function (htmlTemplate) {
              var tmp = angular.element(document.querySelector('.dg-modal-content')).html(htmlTemplate.data);
              $compile(tmp)(scope);
            }, function(err){
              $log.error(err);
            })
          }

          


        }


      }
    }
  }
]);

angular.module('dgModal').directive('draggable', ['$document' , '$window', '$log',
  function($document, $window, $log) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        var startX, startY, initialMouseX, initialMouseY;

        if($window.innerWidth >= 1224){
          var modal = elm.parent().parent().parent();


          //elm.css({position: 'absolute'});
          elm.css({cursor:'move'});

   
          elm.bind('mousedown', function($event) {
            $event.preventDefault();
            startX = elm.prop('offsetLeft');
            startY = elm.prop('offsetTop');
            initialMouseX = $event.clientX;
            initialMouseY = $event.clientY;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
            return false;
          });
   
          function mousemove($event) {
            var dx = $event.clientX - initialMouseX;
            var dy = $event.clientY - initialMouseY;
            modal.css({
              top:  startY + dy + 'px',
              left: startX + dx + 'px',
            });
            return false;
          }
   
          function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
          }
        }else{
          $log.info('disabling modal dragging for desktop');
          return
        }



      }
    };
  }]);
