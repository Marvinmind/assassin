var TestApp = angular.module('TestApp', [])
    TestApp.controller('HelloWorldCtl', ['$scope', function($scope){
        console.log('hey')
        $scope.greeting = "Hello World!"
    }]);
