var config = require('../../config');
var nano = require('nano')(config.couchdb);
// TODO: replace bycrpt with scrypt
var bcrypt = require('bcrypt-nodejs');

var db = nano.db.use('users');

// TODO: add change password or email functionality
function User(email, password, id){
	this.email = email;
	this.password = password;
	this.id = id;
};

// Searches the db for the passed email
User.findOneByEmail = function(email, callback){
	db.view('users', 'email', {key: email}, function(err, body){
		if(err) callback(err);

		else if(!body.rows[0]) callback(err, undefined);

		else callback(null, new User(body.rows[0].key, body.rows[0].value, body.rows[0].id));
	});
};

User.prototype.save = function(callback){
	var user = this;

	// TODO: check for existing document
	// Otherwise overwrite/create user
	bcrypt.hash(user.password, null, null, function(err, hash){
		if (err) throw err;

		user.password = hash;
		db.insert({ email: user.email, password: hash}, callback);
	});
};

User.prototype.checkPassword = function(password, callback){
	var user = this;

	bcrypt.compare(password, this.password, callback);
};

module.exports = User;