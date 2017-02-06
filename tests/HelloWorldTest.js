describe('Hello World Test', function(){

    beforeEach(module('assassinsApp'))

    var HelloWorldCtl, scope
    var httpBackend
    var mockSock
    beforeEach(inject(function($rootScope, $controller, $injector){
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/circles').respond({"circles": [
            {"name": "noobies",
                "target": "ute"
            },
            {"name":"theGuild",
                "target":"paul"}
        ]})
        httpBackend.when('GET', '/karl/circles').respond({"circles":[{"name":"noobies",
            "target":"ute"}
        ]})

        scope = $rootScope.$new();

        mockSock = new sockMock(scope)
        HelloWorldCtl = $controller('CirclesCtrl', {
            $scope: scope,
            WebSocket: mockSock
        });
    }));


    it('can call all users', function () {
        httpBackend.flush()
        expect(scope.allCircles).toEqual([
            {"name": "noobies",
                "target": "ute"
            },
            {"name":"theGuild",
                "target":"paul"}
        ]);
    });

    it('can call karl\'s users', function () {
        httpBackend.flush()
        expect(scope.userCircles).toEqual([{"name": "noobies",
            "target": "ute"
        }]);
    });

    it('can update targets', function(){
        httpBackend.flush()
        mockSock.receive('update_target', {"circle":"noobies", "target":"james"})

        expect(scope.userCircles[0].target).toEqual('james')
    })
});


var sockMock = function($rootScope){
    this.events = {};
    this.emits = {};

    // intercept 'on' calls and capture the callbacks
    this.on = function(eventName, callback){
        if(!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(callback);
    };

    // intercept 'emit' calls from the client and record them to assert against in the test
    this.emit = function(eventName){
        var args = Array.prototype.slice.call(arguments, 1);

        if(!this.emits[eventName])
            this.emits[eventName] = [];
        this.emits[eventName].push(args);
    };

    //simulate an inbound message to the socket from the server (only called from the test)
    this.receive = function(eventName){
        var args = Array.prototype.slice.call(arguments, 1);

        if(this.events[eventName]){
            angular.forEach(this.events[eventName], function(callback){
                $rootScope.$apply(function() {
                    callback.apply(this, args);
                });
            });
        };
    };

};
