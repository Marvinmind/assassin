describe('Hello World Test', function(){

    beforeEach(module('TestApp'))

    var HelloWorldCtl, scope

    beforeEach(inject(function ($rootScope, $controller) {
        console.log('create')

        scope = $rootScope.$new();
        HelloWorldCtl = $controller('HelloWorldCtl', {
            $scope: scope
        });
    }));
    it('says hello world!', function () {
        expect(scope.greeting).toEqual("Hello World!");
    });


});