// BASE SETUP -------------------------------
// ======================
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var morgan = require('morgan');

var config = require('./config');


// APP CONFIGURATION --------------------
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));


// ROUTES FOR OUR API -----------------
// =====================
var apiRoutes = require('./api/routes/api')(app, express);
app.use('/api', apiRoutes);

// catch-all route
app.get('*', function(req, res) {
	res.send('No no... no');
});

// START THE SERVER
// ===============================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);