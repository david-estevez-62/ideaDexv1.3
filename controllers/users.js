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

// //   createNew: function(req, res){
// //     var newUser = new User(req.body);
// //     newUser.save(function(err, result){
// //       res.send(result);
// //     });
// //   }
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
				res.send(user);
			});
			console.log('this is req.body in guestUpdateInfo: ', req.user);
		});
	},

	AddPost: function (req, res) {
		var data = req.body;
		var id = req.user._id;

		// var lastElem = req.user.posts.pop();
		// var pluck = _.pluck(lastElem, 'uid');
		// console.log(lastElem);
		// console.log(pluck);
	
		

		// console.log('this is req.body in guestUpdateInfo: ', req.user);
		User.findById(id, function(err, user) {
			if (err) return handleErr(err);

			


			// var id = _.pluck((user.posts), "uid");
			// console.log(id);




			// var lastId = Number(id.pop());

			// console.log(lastId);

			// var addId = lastId++
		// console.log(addId);
		
		 	// var pluck = _.pluck((user.posts), "uid");
		 	// console.log(pluck);
			// var lastElem = pluck.pop();

			// console.log(lastElem);
			// var add1 = lastElem++;
		var uid =shortid.generate();

		newPost = {
				contents: data.postData,
		        _id: uid,
		      	privacy: data.privacy,
		      	username: req.user.username
		    }
			
		  

		   	user.posts.push(newPost);

		   	if (newPost.privacy === 'false') {
		   		user.publicPosts.push(newPost);
		   	}



			user.save(function(err, user){
				if(err) return handleErr(err);
				res.send(user);
				// res.redirect('/'+id+'/home');
			});

		});


	}

}

module.exports = usersController;