/**
 * Created by martin on 27.01.17.
 */
console.log('loaded')
angular.module('assassinsApp', [])
    .controller('CirclesCtrl', function($scope, $http){

        function getNextTarget(name, list){
            playerIndex = list.indexOf(name)
            if (playerIndex =>0){
                victimIndex = (playerIndex+1)%list.length
                return {name: list[victimIndex], index : victimIndex }
            }
        }

        $scope.user = 'karl'

        $http.get('circlesMock.json').then(function (result) {
            result = result.data.circles
            console.log(result)
            $scope.circlesMock = result
            for (res in result){
                res = result[res]

                n = res.name
                victim = getNextTarget($scope.user, res.alive)
                $scope.circles.push({name: n, nextVictim: victim.name})
            }
        })
        $scope.circlesMock = []
        $scope.circles = []
        $scope.gameStatus = ''
        $scope.getCircles = function () {
            return circles
         }

        $scope.joinCircle = function (circle) {
            $scope.circlesMock.push(circle)
        }

        $scope.getCircle = function(name) {
            return $scope.circles.filter(function (obj) {
                return obj.name = name
            })
        }

        $scope.killTarget = function (circleName) {
            $http.post('localhost:3000/'+$scope.user+'/circleName/killTarget')

        }

        $scope.killTarget = function (circleName) {
                circleMockObject = $scope.circlesMock.filter(function(obj){
                    return obj.user == circleName
                })[0]
                if (circleMockObject.alive.length== 1){
                    if (circleMockObject.alive[0] == userName) {
                        gameStatus = 'user won'
                    }
                    else{
                        gameStatus = 'user lost'
                    }
                }
                let userIndex = circleMockObject.alive.indexOf(userName)
                if (userIndex<0){
                    console.log('user not found!!')
                }
                else{
                    victimIndex = (userIndex+1)%circleMockObject.alive.length
                    circleObj = $scope.circles.filter(function (obj) {
                        return obj.user == circleName
                    })
                    circleObj.nextVictim = circleMockObject.alive[victimIndex]
                    circleMockObject.alive.splice(victimIndex,1)
                }
        }
    })
    .directive('myCircle', function(){
        return{
            template: '<li>Name: {{circle.name}} <br>Next Target: {{circle.nextVictim}}'
        }
    });
