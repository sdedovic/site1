var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = function(app, express){
	var apiRouter = express.Router();

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

	apiRouter.route('/users')
		.post(function(req, res){
			var user = new User();

			user.email = req.body.email;
			user.password = req.body.password;

			user.save(function(err, body){
				if(err) console.log(err);

				res.json({message: 'User Created!'});
			});
		});

	return apiRouter;
};