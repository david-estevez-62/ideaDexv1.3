// var User = require('../models/users.js');

// var usersController = {
// //   getAll: function(req, res){
// //     if(req.query._id){
// //       // If there is a query parameter for _id,
// //       // get an individual item:
// //       User.findById(req.query._id, function(err, result){
// //         res.send(result);
// //       });
// //     } else {
// //       // else, get all items
// //       // Go to DB and find all news items
// //       User.find({}, function(err, results){
// //         // Send the entire array of results
// //         // to the client as JSON
// //         res.send(results);
// //       });
// //     }
// //   },

// //   // getNonPriv: function(req,res){
// // // 
// //   // },

// //   createNew: function(req, res){
// //     var newUser = new User(req.body);
// //     newUser.save(function(err, result){
// //       res.send(result);
// //     });
// //   }
// 	EditSettings: function(req, res) {
// 		var data = req.body;
// 		var id = req.user._id;
// 		console.log('this is req.body in hostUpdateInfo: ', req.user);
// 		User.findById(id, function(err, user) {
// 			if (err) return handleErr(err);
// 			user.username = data.username || user.username;
// 			user.password = data.password || user.password;
// 			// user.profilePic = data.profilePic || user.profilePic;
		
// 			user.save(function(err, user) {
// 				if(err) return handleErr(err);
// 				res.send(user);
// 			});
// 		});
// 	}


// };

// module.exports = usersController;