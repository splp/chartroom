var http = require('http');
var fs   = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var chatServer = require('./lib/chat_server.js');
chatServer.listen(server);

function send404 (response) {
        response.writeHeader(404,{'content-type':"text/plain"});
        response.write("Error 404:resource not found.");
        response.end();
}
function sendFile (response, filePath, fileContent) {
    response.writeHeader(200,{'content-type':mime.lookup(path.basename(filePath))});
    response.end(fileContent);
}

function serverStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists){
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                   if (err) {
                       send404(response);
                   } else {
                       cache[absPath] = data;
                       sendFile(response, absPath, data);
                   }

                });
            } else {
                send404(response);
            }
        })
    }

}
var server = http.createServer(function(request, response){
    var filePath = false;
//console.log(request.url);
    if(request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath  = './' + filePath;
    serverStatic(response, cache, absPath);
})

server.listen(3000, function(){
    console.log("server listening on port 3000");
})