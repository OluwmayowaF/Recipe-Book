let express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

//postgres DB connection string

const { Pool, Client } = require('pg')
const connectionString = 'postgresql://Mawhizzle:mayowa@localhost:5442/recipebookdb'
const pool = new Pool({
    connectionString: connectionString,
})

// Assign Dust Engine to .dust files 
app.engine('dust', cons.dust);

// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set Public folder 
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    client.query('SELECT * FROM recipes', (err, result) => {
        res.render('index', { recipes: result.rows })
        client.end()
    })

});

app.post('/add', function(req, res) {

    const pool = new Pool({
        connectionString: connectionString,
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions], (err, res) => {
        console.log(err, res)
        client.end()

    })
    res.redirect('/');

});

app.delete('/delete/:id', function(req, res) {
    const pool = new Pool({
        connectionString: connectionString,
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    client.query('DELETE FROM recipes WHERE id =$1', [req.params.id], (err, res) => {
        console.log(err, res)
        client.end()

    })
    res.send(200);


});

app.post('/edit', function(req, res) {

    const pool = new Pool({
        connectionString: connectionString,
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4 ', [req.body.name, req.body.ingredients, req.body.directions, req.body.id], (err, res) => {
        console.log(err, res)
        client.end()

    })
    res.redirect('/');

});

//Server
app.listen(3000, function() {
    console.log('Server started on PORT 3000');
});