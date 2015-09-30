var jwt = require('jsonwebtoken');
var User = require('../models/users');
var config = require('../../config');
var nano = require('nano')(config.couchdb);
var rack = require('hat').rack();


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
	// token verrification
	apiRouter.use(function(req, res, next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if(token){
			jwt.verify(token, config.secret, function(err, decoded){
				if(err)
					return res.json({
						success: false,
						message: 'Failed to authenticate token'
					});
				else{
					req.decoded = decoded;
					next();
				}
			});
		} else
			return res.status(403).send({
				success: false,
				message: 'No token provided'
			});
	});



	// new image creation
	apiRouter.route('/images')
		.post(function(req, res){
			req.pipe(nano.use('images').attachment.insert(rack(), 'image.jpg', null, 'image/jpg'));
			res.status(200).end();
	  	})
	  	.get(function(req, res){
	  		nano.use('images').list(function(err, body){
	  			if(err) throw err;

	  			res.json(body);
	  		});
	  	});

	  // specific image functions
	  apiRouter.route('/images/:id')
	  	.get(function(req, res){
	  		nano.use('images').attachment.get(req.params.id, 'image.jpg').pipe(res);
	  	});

	return apiRouter;
};