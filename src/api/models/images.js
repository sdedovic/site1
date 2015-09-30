var config = require('../../config');
var nano = require('nano')(config.couchdb);

var db = nano.db.use('images');

function Image(){};

Image.prototype.save = function(callback){
	var image = this;

	db.attachment/({image: image.name}, function(err, body){
	});
};


module.exports = Image;