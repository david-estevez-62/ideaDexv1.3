var User = require('../models/users.js');
var _ = require('underscore');
var shortid= require('shortid');




var usersController = {
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


	EditSettings: function (req, res) {
		var data = req.body;
		var id = req.user.username;
		
		User.findOne(id, function(err, user) {
			if (err) return handleErr(err);
			user.username = data.username || user.username;
			user.password = data.password || user.password;
			user.imgUrl = data.imageUrl || user.imageUrl;
			user.incomplete = false;
			user.save(function(err, user) {
				if(err) return handleErr(err);
				res.redirect('/'+id+'/edit')
			});
			console.log('this is req.body in guestUpdateInfo: ', req.user);
		});
	},

	AddPost: function (req, res) {
		var data = req.body;
		var id = req.user._id;
		var username = req.user.username;

	
		

		// console.log('this is req.body in guestUpdateInfo: ', req.user);
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);

		var uid = shortid.generate();

		newPost = {
				contents: data.postData,
		        _id: uid,
		      	privacy: data.privacy,
		      	username: req.user.username
		    }
			
		  

		   	user.posts.push(newPost);

		   	if (newPost.privacy === 'false') {
		   		user.publicPosts.push(newPost);

		   		// console.log(User.find({username:username}))

		   		// // create a for loop, for all followers in users list push to their discover array
		   		// User.find({followers:username}, function(err, users){
		   		// 	console.log(users);
		   		// 	// users.discover.push(newPost);
		   		// })

		   	}

			user.save(function(err, user){
				if(err) return handleErr(err);
				res.send(user);
				// res.redirect('/'+id+'/home');
			});

		});


	},
	FollowUser: function(req,res){
		var data = req.body;
		var id = req.user._id;
		var username = req.user.username;

	    User.findById(id, function (err, user) {
	    if (err) return handleErr(err);

		user.following.push(data.usersProf);

		    user.save();

		});

		User.findOne({username:data.usersProf}, function (err, user) {
	    if (err) return handleErr(err);

		user.followers.push(username);
			console.log(data.usersProf);

		    user.save();
		    res.redirect('back');
		    // res.redirect('/user/' + username + '/' + data.usersProf);

		});

	}
	// ,
	// PushPublic: function(req,res){
	// 	var data = req.body;
	// 	var username = req.user.username;

	// 	User.find({followers: username}, function(err, user) {
	// 		user.followers.push()
	// 	});

	// }



	// RemovePost: function(req, res){
	// 	var data = req.body;
	// 	var id = req.user._id;

	// 	User.findById(id, function(err, user) {
	// 		if (err) return handleErr(err);
	// 		var toDelete = data.targetId;
	// 		User.findByIdAndRemove(toDelete, function(err, result){

	// 		})

	// 	})
	// }

}

module.exports = usersController;