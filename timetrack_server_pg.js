var pg = require('pg');
var conString = 'tcp://myuser:mypasword@localhost:5432/mydatabase';
var client = new pg.Client(conString);
client.connect();


//client.query("Insert into users " + '(name) values ("Mike")');

client.query("Insert into users " + '(name,age) values ($1, $2)',['Mike', 39]);

client.query("INSERT INTO users " + "(name, age) VALUES ($1, $2) " + "RETURNING ID",
    ['Mike', 39], function(err, result) {
        if (err) throw err;
        console.log("Insert ID is" + result.rows[0].id);
    });
