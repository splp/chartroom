var connect = require('connect');

function errorHandler() {
    var env = process.env.NODE_ENV || 'development';
    return function (err, req, res, next) {
        res.statusCode = 500;
        switch (env) {
            case 'development':
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server error');
        }
    }
}
connect().use(router(require('./routes/user')))
.use(router(require('./routes/blog')))
.use(router(require('./routes/admin')))
.use(errorHandler());

var api = connect()
.use(users).use(pets).use(errorHandler);
var app = connect()
    .use(hello)
    .use('/api',api)
    .use(errorPage)
    .listen(3000);



function hello(req, res, next) {
    if(req.url.match(/^\/hello/)) {
        res.end('Hello world\n');
    } else {
        next();
    }
}

var db = {
    users : [
        {name:'tobi'},
        {name:'loki'},
        {name:'jane'},
        {name:'jobs'}
    ]

};
function users(req, res, next) {
    var match = req.url.match(/^\/user\/(.+)/);
    if (match) {
        var user = db.users[match[1]];
        if (user) {
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(user));
        } else {
            var err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else  {
        next();
    }
}

function pets (req, res, next) {
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo();
    } else {
        next();
    }
}

function errorHandler(err, req, res, next) {
    console.log(err.stack);
    res.setHeader('Content-Type','application/json');
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({error:err.message}));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({error:"Internal Server Error"}));
    }

}

function errorpage (err, req, res, next){

}