var TestApp = angular.module('TestApp', [])
    .controller('HelloWorldCtl', function($scope, $http){
        console.log('hey')
        $scope.greeting = "Hello World!"
        $scope.callHome = function(){
            console.log('call')
            $http.get('/hello').then(function(res){
                alert('change scope')
                $scope.httpMessage = res.data.message
            });
        }
    })
    .factory('ws', [ '$rootScope', function ($rootScope) {
    'use strict';
    var socket = io.connect();

    return {
        on: function (event, callback) {
            socket.on(event, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(null, args);
                });
            });
        }
    };
    }]);
