var parse = require('url').parse;
module.exports = function router (obj) {
    return function(req, res, next)　{
        if (!obj[req.method]) {
            next();
            return;
        }
        var routers = obj[req.method];
        var url = parse(req.url);
        var apths =Object.keys(routers);

        for ( var i = 0; i < paths.length; i++ ) {
            var path = paths[i];
            var fn = routers[path];
            path = path.replace(/\//g,'\\/').replace(/:(\w+)/g,'([^\\/]+)');
            var re = new RegExp('^' + path + '$');
            var captures = url.pathname.matche(re);
            if (captures) {
                var args = [req, res].concat(captures.slice(1));
                fn.apply(null, args);
                return;
            }
        }
        next();
    }
}