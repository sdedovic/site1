var User = require('../models/users');
// var Images = require('../models/images');
var config = require('../../config');
var busboy = require('connect-busboy');
var jwt = require('jsonwebtoken');

var nano = require('nano')(config.couchdb);
var db = nano.db.use('images');

module.exports = function(app, express){
	var apiRouter = express.Router();

	// user login
	apiRouter.post('/authenticate', function(req, res){
		User.findOneByEmail(req.body.email, function(err, user){
			if (err) console.log(err, body);

			if(!user)
				res.json({
					success: false,
					message: 'User not found'
				});
			else{
				user.checkPassword(req.body.password, function(err, result){
					if(err) console.log(err);
					
					if(!result)
						res.json({
							success: false,
							message: 'Wrong password'
						});
					else{
						var token = jwt.sign({id: user.id},
							config.secret, {expiresInMinutes: 1440});

						res.json({
							success: true,
							message: 'Enjoy your token',
							token: token
						});
					}
				});
			}
		});
	});
	// new user creation
	apiRouter.post('/users', function(req, res){
			var user = new User();

			user.email = req.body.email;
			user.password = req.body.password;

			user.save(function(err, body){
				if(err) console.log(err);

				res.json({message: 'User Created!'});
			});
		});

	// new image creation
	apiRouter.post('/images', function(req, res){
		console.log(req);
		req.pipe(db.attachment.insert('new', 'rab.jpg', null, 'image/jpg'));
		res.send('uhhh idk?');
  	});

	return apiRouter;
};