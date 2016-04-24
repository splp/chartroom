var http = require('http');
var fs = require('fs');
http.createServer(function(req, res) {
    if(req.url == '/') {
        fs.readFile('./title.json',function(err, data){
            if(err) {
                console.error(err);
                res.end("Server Error");
            } else {
                var titles = JSON.parse(data.toString());
                fs.readFile('./template.html',function(err, data) {
                    if(err) {
                        console.error(err);
                        res.end("SERVER ERROR");
                    } else {
                        var tmpl = data.toString();
                        var html = tmpl.replace('%', titles.join('</li><li>'));
                        res.writeHead(200, {'content-type':'text/html'});
                        res.end(html);
                    }
                })
            }
        })
    }
}).listen(8000,'127.0.0.1');

var server = http.createServer(function (req, res) {
    getTitle(res);
}).listen(8000,'127.0.0.1');

function getTitles (res) {
    fs.readFile('./title.json', function (err, data) {
        if (err) {
            handError(err, res);
        } else {
            getTemplate(JSON.parse(data.toString()), res);
        }
    })
}

function getTemplate (titles, res) {
    fs.readFile('./template.html', function (err, data) {
        if (err) {
            handError(err, res);
        } else {
            formatHtml(titles, data.toString(), res);
        }
    })
}

function formatHtml (title, tmpl , res) {
 var html = tmpl.replace('%', title.join("</li><li>"));
    res.writeHead(200, {"content-type":"text/html"});
    res.end(html);
}

function handError (err, res) {
    console.error(err);
    res.end("SERVER ERROR");
}