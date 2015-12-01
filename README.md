# node-pg-restify

Under development

Common commands with PostgreSQL over REST API

## Usage
```
node server.js
```
Running default name, password and db name.

```
node server.js --name myname --password mypassword --db mydb
```

Running query
``` curl -H "Content-Type: application/json" -X POST -d '{"query": "SELECT * FROM dbname;"}' localhost:8080/query ```

Or just as 

``` curl -H "Content-Type: application/json" -X POST -d '{"table": "films"}' localhost:8080/table ```

## License
MIT

