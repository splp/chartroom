var qs = require("querystring");
exports.sendHtml = function(res, html) {
    res.setHeader("Content-type", 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}
exports.parseReceivedData = function(req, db) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){
        body += chunk;
    })
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    })
}
exports.actionForm = function(id, path, label) {
    var html = '<form method="post" action="' + path +'">'+
            '<input type="hidden" name="id" value="'+id+'"/>'+
            '<input type="submit" value="'+label +'"/>'+'</form>';
    return html;
}
exports.add = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
       db.query("Insert into work (hours, date, description) "+" values (?,?,?)",
       [work.hours, work.date, work.description],
       function (err) {
           if (err) throw err;
           exports.show(db, res);
       });
    });
}
exports.delete = function(db, req, res) {
    exports.parseReceivedData (req, function(work) {
        db.query(
            "Delete from work where id=?",[work.id], function(err) {
                if (err) throw err;
                exports.show(db, res);
            }
        )
    });
}

exports.archive = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query("update work set archived=1 where id=?",
        [work.id], function(err) {
                if　(err) throw err;
                exports.show(db, res);
            })
    })
}

exports.show = function (db, res, showarchived) {
        var query = "select * from work" +
                "where archived=?"+"order by date desc";
    var archiveValue = (showarchived) ? 1 : 0;
    db.query(query,[archiveValue],function(err, rows) {
       if(err) throw err;
        html = (showarchived) ? '' : '<a href="/archived">Archived Work</a><br />';
        html += exports.workHitlistHtml(rows);
        html += exports.workFormHtml();
        exports.sendHtml(res, html);
    });
};
exports.showArchived = function (db, res) {
    exports.show(db, res, true);
}

exports.workHitlistHtml = function (rows) {
    var html = '<table>';
    for (var i in rows) {
         html += '<tr>';
        html += '<td>' + rows[i].date +'</td>';
        html += '<td>' + rows[i].hours +'</td>';
        html += '<td>' + rows[i].description + '</td>';
        if (!rows[i].archived) {
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
        }
        html += '<td>' + exports.workDeleteForm[rows[i].id] +'</td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

exports.workFormHtml = function() {
    var html = '<form method="post" action="/">' +
            '<p>Date(YYYY-MM-DD):<br /><input type="text" name="date" /></p>' +
            '<p>Hours worked:<br /><input name="hours" type="text"></p>'+
            '<p>Description:<br/>'+
            '<textarea name="description"></textarea>'
        +'</p><input type="submit" value="Add" /></form>';
    return html;
};
exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Archive');
}
exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
}