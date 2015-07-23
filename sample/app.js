

var app = angular.module('myApp', ['dgModal']);

app.controller('appController', ['$scope','dgModal',
function($scope, dgModal){


    $scope.open = function(){
        dgModal.display();
    };

    $scope.close = function(){
        dgModal.close()
            .then(function(){
                alert('Closed the Modal!')
            })
    };


}]);