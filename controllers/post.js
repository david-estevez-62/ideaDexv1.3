var User = require('../models/users.js');
var _ =  require('underscore');

var postController = {

  Upvote: function(req, res){
    var currentUser = req.user._id;
      var username =req.body.userPosted;
      var postid = req.body.thisPost;

      // console.log(username)


      User.findOne({username:username}, function(err, user){
        if (err) return handleErr(err);





        // console.log(user)

        for (var i = 0; i < user.posts.length; i++) {

            if(user.posts[i]._id=== postid){

              // console.log(user.posts[i].uwv.length)
              if(user.posts[i].uwv.length===0){
                user.posts[i].uwv.push(currentUser);
                    user.posts[i].rating +=1;
                    user.save();
                    // console.log(currentUser)
              }
              else{
                // console.log('hi')
                //
                //
                // for(var j= 0; j<user.posts[i].uwv.length;j++){
                //  var usersVoted = user.posts[i].uwv[j]
                // // console.log(usersVoted)
                // }

                //  var z = usersVoted.toString();
                // console.log(typeof z);

                var usersVoted = user.posts[i].uwv;
                // console.log(usersVoted)
                var thisUser = currentUser.toString();
                // console.log(typeof thisUser)



                var userVoted = _.filter(usersVoted, function(obj){
                  var x = obj.toString();
                  // console.log(x)
                  // console.log(typeof x)
                  // console.log(thisUser)
                  // console.log(typeof x)

                  // y = currentUser.toString();

                  return x === thisUser;
                });
                  var y = userVoted.toString();
                  // console.log(userVoted)
                  // console.log(y)
                  // console.log(typeof y)
                  // console.log(x)
                  // console.log(thisUser)

                  if(y===thisUser){
                    console.log('do nothing');
                  }
                  else{
                    console.log('hi');
                          user.posts[i].uwv.push(currentUser);
                          user.posts[i].rating +=1;
                          user.save();
                          return false;
                  }

            }
          }

      }


      // Rating by followers
      for (var i = 0; i < user.followers.length; i++) {
          User.findOne({username:user.followers[i]}, function(err, follower){

            console.log(currentUser);

            for (var j = 0; j < follower.discover.length; j++) {

              if(follower.discover[j]._id=== postid){

                if(follower.discover[j].uwv.length===0){
                      follower.discover[j].uwv.push(currentUser);
                          follower.discover[j].rating +=1;
                          follower.save();
                          // console.log(currentUser)
                    }
                    else{
                      // console.log('hi')
                      //
                      //
                      // for(var j= 0; j<user.posts[i].uwv.length;j++){
                      //  var usersVoted = user.posts[i].uwv[j]
                      // // console.log(usersVoted)
                      // }

                      //  var z = usersVoted.toString();
                      // console.log(typeof z);

                      var usersVoted = follower.discover[j].uwv;
                      // console.log(usersVoted)
                      var thisUser = currentUser.toString();
                      // console.log(typeof thisUser)



                      var userVoted = _.filter(usersVoted, function(obj){
                        var x = obj.toString();
                        // console.log(x)
                        // console.log(typeof x)
                        // console.log(thisUser)
                        // console.log(typeof x)

                        // y = currentUser.toString();

                        return x === thisUser;
                      });
                        var y = userVoted.toString();
                        // console.log(userVoted)
                        // console.log(y)
                        // console.log(typeof y)
                        // console.log(x)
                        // console.log(thisUser)

                        if(y===thisUser){
                          console.log('do nothing');
                        }
                        else{
                          console.log('hi');
                                follower.discover[j].uwv.push(currentUser);
                                follower.discover[j].rating +=1;
                                follower.save();
                                return false;
                        }

                    }

                // user.save();
                follower.save();
              }
            }

            // follower.save();
          });

      }




      });



  },

  Downvote: function(req, res) {

      var currentUser = req.user._id;
      var username =req.body.userPosted;
      var postid = req.body.thisPost;

      // console.log(currentUser);

     User.findOne({username:username}, function(err, user){
        if (err) return handleErr(err);





        // console.log(user)

        for (var i = 0; i < user.posts.length; i++) {

            if(user.posts[i]._id=== postid){

              // console.log(user.posts[i].uwv.length)
              if(user.posts[i].uwv.length===0){
                user.posts[i].uwv.push(currentUser)
                    user.posts[i].rating -=1
                    user.save();
                    // console.log(currentUser)
              }
              else{
                // console.log('hi')
                //
                //
                // for(var j= 0; j<user.posts[i].uwv.length;j++){
                //  var usersVoted = user.posts[i].uwv[j]
                // // console.log(usersVoted)
                // }

                //  var z = usersVoted.toString();
                // console.log(typeof z);

                var usersVoted = user.posts[i].uwv;
                // console.log(usersVoted)
                var thisUser = currentUser.toString();
                // console.log(typeof thisUser)



                var userVoted = _.filter(usersVoted, function(obj){
                  var x = obj.toString();
                  // console.log(x)
                  // console.log(typeof x)
                  // console.log(thisUser)
                  // console.log(typeof x)

                  // y = currentUser.toString();

                  return x === thisUser;
                })
                  var y = userVoted.toString();
                  // console.log(userVoted)
                  // console.log(y)
                  // console.log(typeof y)
                  // console.log(x)
                  // console.log(thisUser)

                  if(y===thisUser){
                    console.log('do nothing');
                  }
                  else{
                    console.log('hi');
                          user.posts[i].uwv.push(currentUser);
                          user.posts[i].rating -=1;
                          user.save();
                          return false;
                  }
          // user.save(function(err, user){
          //   if(err) return handleErr(err);
          //   for (var i = 0; i < user.followers.length; i++) {
          //     User.findOne({username:user.followers[i]}, function(err, follower){
          //       console.log(follower)

          //       for (var j = 0; j < follower.discover.length; j++) {

          //         if(follower.discover[j]._id=== postid){

          //           follower.discover[j].rating -=1

          //           // user.save();
          //           follower.save();
          //         }
          //       };

          //       // follower.save();
          //     })

          //   };

          //   res.send('success')

          // });
            }
          }
        }

      });
    // res.redirect('/'+username+'/home');
  }

};

module.exports = postController;