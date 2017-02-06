/**
 * Created by martin on 27.01.17.
 */
angular.module('assassinsApp', ['btford.socket-io'])
    .controller('CirclesCtrl', function($scope, $http, mySocket){
        console.log('ready for socket')
        console.log(mySocket)
        var sockServer = 'http://localhost:4200'
        var WebSocket = mySocket.connect(sockServer)
        WebSocket.emit('hello', {"hello":"hey"})
        console.log('run!')
        var getCircle = function(name){
            console.log(name)
            return circ = $scope.userCircles.filter(function(obj){
                return obj.name == name
            })[0]
        }
        $scope.user = 'karl'
        $http.get('/circles').then(function(res){
            $scope.allCircles = res.data.circles
        })

        $http.get(`/${$scope.user}/circles`).then(function(res){
            $scope.userCircles = res.data.circles
        })
        WebSocket.on(function(res){
            if (res.data)
            circ = getCircle(res.circle)
            circ.target = res.target
        })

    })
    .factory('mySocket', function (socketFactory) {
        opts = {}
        opts.ioSocket = io.connect('http://localhost:4200')
        return socketFactory(opts);
    })

    .directive('myCircle', function(){
        return{
            template: '<li>Name: {{circle.name}} <br>Next Target: {{circle.nextVictim}}'
        }
    });
