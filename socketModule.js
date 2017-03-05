/**
 * Created by martin on 05.02.17.
 */


var sockets = []

ex = {}
ex.createServer = function (app) {
    var server = require('http').createServer(app);
    var io = require('socket.io')(server)
    server.listen(4200)
    console.log('listening')

    io.on('connection', function(socket){
        var hash = {}
        hash.socket = socket
        sockets.push(hash)

        io.emit('update', {'data': 'new hell yeah update!!'})
        socket.on('authenticate', function (data) {
            hash.user = data.name
        })


    })
}
ex.updateTarget = function(user, circle, target){
    console.log('ab geht die lutzi')
    console.log(target)
    var userSocks = sockets.filter(obj => {
        return obj.user == user
    })
    userSocks.forEach(function(socket){
        console.log('send event')
        socket.socket.emit('update_target', {circle:circle, target:target})
    })
}

module.exports = ex


