/**
 * Created by martin on 05.02.17.
 */


ex = {}
ex.createServer = function (app) {
    var server = require('http').createServer(app);
    var io = require('socket.io')(server)
    server.listen(4200)
    console.log('listening')

    io.on('connection', function(socket){
        console.log('said hello')
    })
}

module.exports = ex


