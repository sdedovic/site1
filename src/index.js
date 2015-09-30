// BASE SETUP -------------------------------
// ======================
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var morgan = require('morgan');
var config = require('./config');
var nano = require('nano')(config.couchdb);


// APP CONFIGURATION --------------------
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
// app.use(function(req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
// 	next();
// });

// setup db if need be
nano.db.create('users', function(err, body){
	// this lists users by email. used to search the db for logging in
	nano.db.use('users').insert({
		_id: '_design/users',
		_rev: '1-8c6878eaf5e7713e85ee57f2639c6954',
		language: 'javascript',
		views: {
			email:{
				map: function(doc) {
					if(doc.email && doc.password)
						emit(doc.email, doc.password);
				}
			}
		}
	});
});
nano.db.create('images');
nano.db.create('jive');

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