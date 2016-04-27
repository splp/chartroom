var http  = require('http');
var parse = require('url').parse;
var join  = require('path').join;
var fs    = require('fs');

var root  = __dirname;
//console.log(__dirname);
var server = http.createServer(function(req,res){
    var url = parse(req.url);
    var path = join(root, url.pathname);
    var stream = fs.createReadStream(path);
   /* stream.on('data', function(chunk) {
        res.write(chunk);
    });
    stream.on("end", function() {
        res.end();
    });*/
    stream.pipe(res);
});
var server = http.createServer(function(req, res) {
    var url = parse(req.url);
    var path = join(root,url.pathname);
    fs.stat(path,function(err, stat){
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end("internal Server Error");
            }
        } else {
            res.setheader('Content-Length',stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function(err) {
                res.statusCode = 500;
                res.end("Internal Server Error");
            })
        }
    })
})
var readStream = fs.createReadStream('./original.txt');
var writeStream = fs.createWriteStream('./copy.txt');
readStream.pipe(writeStream);

server.listen(3000);