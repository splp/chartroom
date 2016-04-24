var net = require('net');
var EventEmitter = require('events').EventEmitter;
var channel  = new EventEmitter();
channel.on("join", function () {
    console.log('Welcome');
})
channel.emit('join');
 var server = net.createServer(function(socket){
     socket.on('data', function(data){
         socket.write(data);
     })
     socket.once('data', function (data) {
         socket.write(data);
     })
 })
server.listen(8888);