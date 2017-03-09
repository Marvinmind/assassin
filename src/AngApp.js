/**
 * Created by martin on 27.01.17.
 */
angular.module('assassinsApp', ['btford.socket-io'])
    .controller('CirclesCtrl', function($scope, $http, mySocket){
        $scope.username = 'martin'
        console.log(mySocket)
        $scope.thestatus = 'not updated'
        mySocket.forward('update_target', $scope)
        mySocket.emit('authenticate', {'name':$scope.username})
        $scope.$on('socket:update_target', function(ev, res){
            console.log('update target')
            var circle = $scope.userCircles.filter(obj =>{
                return obj.circleName == res.circle
            })[0]
            console.log(res.target)
            circle.nextTarget = res.target

        })
        console.log('run!')
        var getCircle = function(name){
            console.log(name)
            return circ = $scope.userCircles.filter(function(obj){
                return obj.name == name
            })[0]
        }
        $http.get('/circles').then(function(res){
            $scope.allCircles = res.data.circles
        })

        $http.get(`/users/${$scope.username}`).then(function(res){
            $scope.userCircles = res.data.circles
            console.log($scope.userCircles)
        })

    })
    .factory('mySocket', function (socketFactory) {
        opts = {}
        opts.ioSocket = io.connect('http://localhost:4200')
        return socketFactory(opts);
    })

    .directive('myCircle', function(){
        return{
            template: '<li>Name: {{circle.circleName}} Next Target: {{circle.nextTarget}}</li>'
        }
    });
