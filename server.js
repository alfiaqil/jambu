// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM jambu');
      const results = { 'results': (result) ? result.rows : null};
      // res.render('pages/db', results );
      // client.release();
      res.send(results);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


app.post('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query("insert into jambu(name) values ('"+req.query.dream+"');");
      const results = { 'results': (result) ? result.rows : null};
      // res.render('pages/db', results );
      // client.release();
      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your ' + process.version + ' app is listening on port ' + listener.address().port);
});
