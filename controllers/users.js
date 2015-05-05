var User = require('../models/users.js');
var _ = require('underscore');
var shortid = require('shortid');
var myid = 0;




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


	ChngPassword: function (req, res) {
		var data = req.body;
		var id = req.user._id;
		var username = req.user.username;
		
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);
			user.password = data.password || user.password;
			user.incomplete = false;
			user.save(function(err, user) {
				if(err) return handleErr(err);
				res.send(user);
				// res.redirect('/'+username+'/edit');
			});
			
		});
	},

	ChngUsername: function (req, res) {
		var data = req.body;
		var id = req.user._id;
		var username = req.user.username;

		// console.log(data.username);

		// console.log(id);

		User.findById(id, function(err, user) {
			if (err) return handleErr(err);
			console.log(user)
			user.username = data.username || user.username;
			user.save(function(err, user) {
				if(err) return handleErr(err);
				res.send(user);
				// res.redirect('/'+username+'/edit');
			});
		})
	},

	AddPost: function (req, res) {
		var data = req.body;
		var id = req.user._id;
		var username = req.user.username;

		myid += 1;
		console.log(myid);
	
		// console.log('this is req.body in guestUpdateInfo: ', req.user);
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);

		var uid = shortid.generate();

		newPost = {
				contents: [data.postData],
		        _id: uid,
		      	privacy: data.privacy,
		      	username: req.user.username,
		      	date: data.date,
		      	rating: Number(0),
		      	uwv: []
		    }
			
		   	user.posts.push(newPost);
			   	// if (newPost.privacy === 'false') {
			   	// 	user.publicPosts.push(newPost);
			   	// }

			user.save(function(err, user){
				if(err) return handleErr(err);

				if(newPost.privacy === 'false'){

					for (var i = 0; i < user.followers.length; i++) {
						User.findOne({username:user.followers[i]}, function(err, follower){
							// console.log(follower)
							follower.discover.push(newPost)

							follower.save();
						})
					};
				}
				res.redirect('/'+req.user.username+'/home');
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
		user.notifications.push(username + ' followed your account');


			// console.log(data.usersProf);

		    user.save();
		    res.send(user.notifications);
		    // res.redirect('/user/' + username + '/' + data.usersProf);

		});

	},
	// ,
	// PushPublic: function(req,res){
	// 	var data = req.body;
	// 	var username = req.user.username;

	// 	User.find({followers: username}, function(err, user) {
	// 		user.followers.push()
	// 	});

	// }
	Favorite: function(req, res){
		  var id = req.user._id;
		  var thisUser = req.user.username
		  var username =req.body.userPosted;
		  var postid = req.body.thisPost;
		  var contents = req.body.postContent;

		 favorite = {
		 	thisUser:thisUser,
		 	contents: contents,
		 	_id: postid,
		 	username: username
		 }

		 // console.log(contents)

		 // console.log(typeof postid)
		 // console.log(postid)
		 User.findOne({username:username}, function(err, user){
		 	if (err) return handleErr(err);

		 	user.notifications.push(thisUser + " favorites this idea: " + contents)
		 	user.save();
		 	res.send(user.notifications);
		 })


		 User.findById(id, function(err, user){
		 	if (err) return handleErr(err);
		 	// console.log(user.username);
		 	// console.log(favorite);

		 	var favorites = user.favorites

		 	var alrdyFavorited =_.filter(favorites, function(obj){
	
          		return obj._id === postid
       		})
		 	

		 	if(alrdyFavorited.length === 1){
		 		console.log('do nothing')
		 	}else{
		 		user.favorites.push(favorite)
		 	}
		 	// for(var i = 0; i < user.favorites.length; i++){
		 	// 	if(user.favorites[i]._id!==postid){
		 	// 		user.favorites.push(favorite)

		 	// 	}


		 	// }
		 	user.save();

		 	
		 })


	},
	// Notifications: function(req, res){
	// 	console.log('hi');
	// },


	RemovePost: function(req, res){
		var postid = req.body.thisPost;
		var id = req.user._id;

		User.findById(id, function(err, user) {
			if (err) return handleErr(err);
	
			for (var i = 0; i < user.posts.length; i++) {
			
				if(user.posts[i]._id=== postid){

					user.posts.splice(i, 1)

					user.save();
				}
			};


			user.save(function(err, user){
				if(err) return handleErr(err);
				for (var i = 0; i < user.followers.length; i++) {
					User.findOne({username:user.followers[i]}, function(err, follower){
						// console.log(follower)

						for (var j = 0; j < follower.discover.length; j++) {
			
							if(follower.discover[j]._id=== postid){

								follower.discover.splice(j, 1)

								// user.save();
								follower.save();
							}
						};

						// follower.save();
					})

				};

				res.send('success')
				// res.redirect('/'+id+'/home');
			});
			


			// User.findByIdAndRemove(postid, function(err, result){
			// 	console.log(result)

			// })

		})
	}

}

module.exports = usersController;