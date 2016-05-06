

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res){
    res.setHeader("Content-Type",'text/plain');
    res.end("Hello world");
}

function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) return next(new Error("Unauthorized"));
    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    authenticateWithDatabase(user, pass, function (err) {
        if (err) return next(err);
        next();
    });

}
function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(['tobi','loki','jane']));
            break;
    }
}

var connect = require('connect');
var app = connect();
app.use(logger)
    .use(restrictFileAccess)
    .use(serveStaticFiles)
    .use(hello);
app.listen(3000);

app.use(logger)
    .use('/admin',restrict)
    .use('/admin',admin)
    .use(hello);
app.listen(3000);

//可配置中间件
function setup (format) {
    var regexp = /:(\w+)/g;

    return function logger(req, res, next) {
            var str = format.replace(regexp, function(match, property) {
                return req[property];
            })
        console.log(str);next();
    }
}
module.exports = setup;
app.use(logger({':method :options'}));

var connect = require('connect');
var router = require('./middleware/router');
var routers = {
    GET:{
        '/users': function(req, res) {
            res.end('tobi,loki, ferret');
        },
        '/user/:id': function(req, res, id) {
            res.end('user ' + id);
        }
    },
    DELETE : {
        '/user/:id': function(req, res, id) {
            res.end('deleted user ' + id);
        }
    }
};
 connect().use(router(routers)).listen(3010);