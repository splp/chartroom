var http = require('http');
var url = require('url');
var items = [];
var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                item += chunk;
            });
            req.on('end', function(){
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            var body = items.forEach(function(item,i) {
                return i+')'+item;
            }).join('\n');
            res.setHeader('Content-Length',Buffer.byteLength(body));
            res.setHeader('Content-type','text/plain;charset=utf-8');
            res.end(body);
         default:
        break;
    }
   // req.setEncoding('utf8');
    req.on('data', function(chunk) {
        console.log('paresd',chunk);
    });
    req.on('end', function(){
        console.log('done parsing');
        res.end();
    });
});
