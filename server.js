var restify = require('restify');
var pg = require('pg');
var util = require('util');
var optimist = require('optimist').argv;


var Init = function(username, password, db) {
    var connection = util.format("postgres://%s:%s@localhost/%s", username, password, db);
    var server = restify.createServer({
        name: 'node-pg-restify',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    // Return full result from query
    server.post('/query', function(req, res, next) {
        console.log(req.params.query, connection);
        pg.connect(connection, function(err, client, done) {
            if (err) {
                res.send({result:"null", type: "connection", error: err});
            }

            client.query(req.params.query, function(err, result) {
                done();
                if(err) {
                    res.send({result:"null", type: "query", error:err});
                }

                res.send({result: result, type: "query", error:"null"});
            });
        });
        return next();
    });

    // Return table
    server.post('/table', function(req, res, next) {
        pg.connect(connection, function(err, client, done){
            if(err) {
                res.send({result:"null", type: "connection", error: err});
            }

            var str = util.format('SELECT * FROM %s', req.params.table);
            client.query(str, function(err, result) {
                done();
                if(err) {
                    res.send({result:"null", type: "query", error:err});
                }

                res.send({result: result, type: "query", error:"null"});
            });


        });
    });

    // Show databases
    server.get('/databases', function(req, res, next) {
        pg.connect(connection, function(err, client, done){
            if(err) {
                res.send({result:"null", type: "connection", error: err});
            }

            var str = 'SELECT * FROM pg_database;';
            client.query(str, function(err, result) {
                done();
                if(err) {
                    res.send({result:"null", type: "query", error:err});
                }

                res.send({result: result, type: "query", error:"null"});
            });


        });
    });

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
};

var name = "postgres";
var password = "postgres";
var db = "postgres";

if(optimist.name !== undefined) {
    name = optimist.name;
}

if(optimist.password !== undefined) {
    password = optimist.password;
}

if(optimist.db !== undefined) {
    db = optimist.db;
}

Init(name,password,db);
