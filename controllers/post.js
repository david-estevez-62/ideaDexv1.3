var User = require('../models/users.js');

var postController = {

	Upvote: function(req, res){
		var currentUser = req.user._id;
		  var username =req.body.userPosted;
		  var postid = req.body.thisPost;

		  console.log(currentUser);

		  User.findOne({username:username}, function(err, user){
		    if (err) return handleErr(err);

		    for (var i = 0; i < user.posts.length; i++) {
		      
		        if(user.posts[i]._id=== postid){

		          for(var j= 0; j<user.posts[i].uwv.length;j++){

		              if(user.posts[i].uwv[j] === currentUser){
		                  console.log('do nothing')
		              }else{
		                user.posts[i].uwv.push(currentUser)
		                user.posts[i].rating +=1
		              }

		          }

		          user.posts[i].rating +=1

		          // user.save();
		        }
		      };


		      for (var i = 0; i < user.publicPosts.length; i++) {
		      
		        if(user.publicPosts[i]._id=== postid){
		  
		          user.publicPosts[i].rating +=1

		          // user.save();

		          
		        }
		      };
		      user.save(function(err, user){
		        if(err) return handleErr(err);
		        for (var i = 0; i < user.followers.length; i++) {
		          User.findOne({username:user.followers[i]}, function(err, follower){
		            console.log(follower)

		            for (var j = 0; j < follower.discover.length; j++) {
		      
		              if(follower.discover[j]._id=== postid){

		                follower.discover[j].rating +=1

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


		  })
	},

	Downvote: function(req, res) {

		  var currentUser = req.user._id;
		  var username =req.body.userPosted;
		  var postid = req.body.thisPost;

		  console.log(currentUser);

		  User.findOne({username:username}, function(err, user){
		    if (err) return handleErr(err);

		    for (var i = 0; i < user.posts.length; i++) {
		      
		        if(user.posts[i]._id=== postid){

		          user.posts[i].rating -=1

		          // user.save();
		        }
		      };


		      for (var i = 0; i < user.publicPosts.length; i++) {
		      
		        if(user.publicPosts[i]._id=== postid){
		  
		          user.publicPosts[i].rating -=1

		          // user.save();

		          
		        }
		      };
		      user.save(function(err, user){
		        if(err) return handleErr(err);
		        for (var i = 0; i < user.followers.length; i++) {
		          User.findOne({username:user.followers[i]}, function(err, follower){
		            console.log(follower)

		            for (var j = 0; j < follower.discover.length; j++) {
		      
		              if(follower.discover[j]._id=== postid){

		                follower.discover[j].rating -=1

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


		  })

	}

}

module.exports = postController;