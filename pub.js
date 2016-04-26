var net = require('net');
var events = require('events');
var channel  = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('error', function(err) {
    console.log('ERROR:' + err.message);
});

process.on('uncaughtException', function(err) {
   console.error(err.stack);
    process.exit(1);
});

channel.on('join',function(id,client) {
    this.clients[id] = client;
    this.subscriptions[id] = function(senderID, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast',this.subscriptions[id]);
});
channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast',id, id+' has left the chat\n');
});

channel.on('shutdown', function () {
    channel.emit('broadcast', '', 'chat has shut down \n');
    channel.removeAllListeners('broadcast');
})
var server = net.createServer(function(client) {
    var id = client.remoteAddress+' : ' + client.remotePort;
    client.on("connect", function() {
        channel.emit('join',id,client);
    })
    client.on('data',function(data) {
        data = data.toString();
        if (data == "shutdown\r\n") {
            channel.emit('shutdown');
        }

        channel.emit('broadcast', id, data);
    })
    client.on('close', function () {
        channel.emit('leave',id);
    })

});
server.listen(8888);